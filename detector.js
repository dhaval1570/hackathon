// Simple Academic Stress Detector prototype
// Data model saved in localStorage: tasks: [{id,title,course,dueDate,estHours,selfStress,score,createdAt}]

const taskForm = document.getElementById('taskForm');
const titleEl = document.getElementById('title');
const courseEl = document.getElementById('course');
const dueDateEl = document.getElementById('dueDate');
const estHoursEl = document.getElementById('estHours');
const selfStressEl = document.getElementById('selfStress');
const selfStressVal = document.getElementById('selfStressVal');

const taskList = document.getElementById('taskList');
const overallScoreEl = document.getElementById('overallScore');
const overallLabelEl = document.getElementById('overallLabel');
const chartCanvas = document.getElementById('stressChart');
const ctx = chartCanvas.getContext('2d');

const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');

const toggleCounselor = document.getElementById('toggleCounselor');
const counselorPanel = document.getElementById('counselorPanel');
const avgStressEl = document.getElementById('avgStress');
const topCourseEl = document.getElementById('topCourse');
const dueSoonEl = document.getElementById('dueSoon');

let tasks = JSON.parse(localStorage.getItem('tasks_v1')) || [];

// UI bindings
selfStressEl.addEventListener('input', ()=> selfStressVal.textContent = selfStressEl.value);
taskForm.addEventListener('submit', onAddTask);
clearBtn.addEventListener('click', onClear);
exportBtn.addEventListener('click', onExport);
toggleCounselor.addEventListener('click', ()=> counselorPanel.classList.toggle('hidden'));

// Initialize
renderAll();

function onAddTask(e){
  e.preventDefault();
  const t = titleEl.value.trim();
  const c = courseEl.value.trim();
  const due = dueDateEl.value;
  const hrs = parseFloat(estHoursEl.value) || 0;
  const self = parseInt(selfStressEl.value) || 3;
  if(!t || !due || !c) return alert('Please fill title, course and due date');

  const task = {
    id: 't_' + Date.now(),
    title:t, course:c, dueDate: due, estHours: hrs, selfStress: self,
    createdAt: new Date().toISOString()
  };
  task.score = computeStressScore(task); // compute initial stress score
  tasks.push(task);
  saveAndRender();

  // reset form (keep selfStress default)
  titleEl.value = ''; courseEl.value=''; dueDateEl.value=''; estHoursEl.value='';
}

function onClear(){
  if(!confirm('Clear all saved tasks?')) return;
  tasks = [];
  saveAndRender();
}

function onExport(){
  // Export anonymized CSV (no personal identifiers). Example columns: course,dueDate,estHours,selfStress,score
  if(tasks.length===0) return alert('No tasks to export.');
  const rows = [['course','dueDate','estHours','selfStress','score']];
  tasks.forEach(t => rows.push([t.course,t.dueDate,t.estHours,t.selfStress,t.score]));
  const csv = rows.map(r => r.map(v=> `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'anonymized_tasks.csv'; a.click();
  URL.revokeObjectURL(url);
}

// compute stress score (0-100) using workload, urgency, and self-report
function computeStressScore(task){
  // workload = estHours normalized (0..40)
  const maxHours = 40;
  const workload = Math.min(task.estHours, maxHours) / maxHours; // 0..1

  // urgency: days until due; urgent if within 14 days
  const now = new Date();
  const due = new Date(task.dueDate + 'T23:59:59');
  const msPerDay = 24*60*60*1000;
  const days = Math.ceil((due - now)/msPerDay);
  const urgencyFactor = days <= 0 ? 2.0 : days < 7 ? 1.6 : days < 14 ? 1.2 : 1.0;

  // selfStress normalized 1..5 -> 0..1
  const selfNorm = (task.selfStress - 1) / 4;

  // score formula (weights can be tuned): score = clamp( (workload*0.5 + (1/urgencyFactor)*0.3 + selfNorm*0.2) * 100 )
  // But we want urgency to *increase* stress when days small: so use urgencyMultiplier = (2 - (daysNormalized))
  let daysNormalized = Math.min(Math.max((days)/30, 0), 1); // 0 if due now, 1 if >30 days
  let urgencyMul = 1 + (1 - daysNormalized) * 1.0; // 2 when due now, 1 when far
  // final score:
  let raw = (workload * 0.55 + selfNorm * 0.30) * urgencyMul;
  let score = Math.round(Math.min(100, Math.max(0, raw*100)));
  return score;
}

// UI render helpers
function saveAndRender(){
  localStorage.setItem('tasks_v1', JSON.stringify(tasks));
  renderAll();
}

function renderAll(){
  // recompute scores (update urgency effects)
  tasks.forEach(t => t.score = computeStressScore(t));
  // sort upcoming by due date
  tasks.sort((a,b)=> new Date(a.dueDate) - new Date(b.dueDate));
  renderList();
  renderOverall();
  renderChart();
  renderCounselor();
}

function renderList(){
  taskList.innerHTML = '';
  if(tasks.length===0){ taskList.innerHTML = '<li class="meta">No tasks yet — add one on the left.</li>'; return; }
  tasks.forEach(t=>{
    const li = document.createElement('li');
    li.className = 'task-item';
    const days = daysUntil(t.dueDate);
    li.innerHTML = `
      <div>
        <div style="font-weight:700">${escapeHtml(t.title)} <span style="font-size:12px;opacity:0.85">(${escapeHtml(t.course)})</span></div>
        <div class="meta">Due in ${days} day(s) — Est ${t.estHours} hrs — Self-report ${t.selfStress}/5</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">${t.score}</div>
        <div style="margin-top:6px"><button class="remove" data-id="${t.id}">Remove</button></div>
      </div>
    `;
    taskList.appendChild(li);
  });
  // attach remove handlers
  document.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      tasks = tasks.filter(t=> t.id !== id);
      saveAndRender();
    });
  });
}

function renderOverall(){
  if(tasks.length===0){ overallScoreEl.textContent = '0'; overallLabelEl.textContent = 'Low'; return; }
  const avg = Math.round(tasks.reduce((s,t)=> s + t.score, 0) / tasks.length);
  overallScoreEl.textContent = avg;
  overallScoreEl.style.color = avg > 70 ? '#ff6b6b' : avg > 45 ? '#ffd166' : '#9be15d';
  overallLabelEl.textContent = avg > 70 ? 'High' : avg > 45 ? 'Moderate' : 'Low';

  // Suggestions / alerts
  if(avg > 70){
    if(!document.getElementById('alertBox')){
      const alertBox = document.createElement('div');
      alertBox.id = 'alertBox';
      alertBox.style.marginTop = '8px';
      alertBox.style.padding = '10px';
      alertBox.style.borderRadius = '8px';
      alertBox.style.background = 'rgba(255,107,107,0.12)';
      alertBox.style.color = '#fff';
      alertBox.innerHTML = `<strong>High stress detected.</strong> Consider contacting your counselor, prioritizing tasks, or splitting work into smaller chunks.`;
      overallScoreEl.parentElement.appendChild(alertBox);
    }
  } else {
    const ab = document.getElementById('alertBox'); if(ab) ab.remove();
  }
}

function renderChart(){
  // simple bar chart of tasks' scores
  const w = chartCanvas.width; const h = chartCanvas.height;
  ctx.clearRect(0,0,w,h);
  const margin = 40;
  const usableW = w - margin*2;
  const usableH = h - margin*2;
  const n = tasks.length || 1;
  const barW = Math.max(12, usableW / n * 0.7);
  tasks.forEach((t,i)=>{
    const x = margin + i * (usableW / n) + (usableW / n - barW)/2;
    const barH = (t.score / 100) * usableH;
    const y = h - margin - barH;
    // color from green to red
    const color = t.score > 70 ? '#ff6b6b' : t.score > 45 ? '#ffd166' : '#9be15d';
    ctx.fillStyle = color;
    roundRect(ctx, x, y, barW, barH, 6, true, false);
    // label
    ctx.fillStyle = '#fff';
    ctx.font = '12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.title, x + barW/2, h - margin + 14);
    ctx.fillText(t.score, x + barW/2, y - 8);
  });
}

// counselor anonymized stats
function renderCounselor(){
  if(tasks.length===0){ avgStressEl.textContent='—'; topCourseEl.textContent='—'; dueSoonEl.textContent='0'; return; }
  const avg = (tasks.reduce((s,t)=> s + t.score,0) / tasks.length).toFixed(0);
  avgStressEl.textContent = avg;
  // top course by avg score
  const byCourse = {};
  tasks.forEach(t => {
    if(!byCourse[t.course]) byCourse[t.course] = {sum:0, count:0};
    byCourse[t.course].sum += t.score; byCourse[t.course].count++;
  });
  let top = null, topAvg = -1;
  for(const c in byCourse){
    const a = byCourse[c].sum / byCourse[c].count;
    if(a > topAvg){ topAvg = a; top = c; }
  }
  topCourseEl.textContent = top || '—';
  // due soon
  const dueSoon = tasks.filter(t => daysUntil(t.dueDate) <= 7).length;
  dueSoonEl.textContent = dueSoon;
}

// helpers
function daysUntil(dateStr){
  const now = new Date();
  const due = new Date(dateStr + 'T23:59:59');
  const msPerDay = 24*60*60*1000;
  return Math.max(0, Math.ceil((due - now)/msPerDay));
}
function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if (r === undefined) r = 5;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// kickstart with demo data if none
if(tasks.length === 0){
  tasks = [
    { id:'demo1', title:'Math Midterm', course:'MATH101', dueDate: addDaysToISO(5), estHours:10, selfStress:4, createdAt:new Date().toISOString() },
    { id:'demo2', title:'Essay Draft', course:'ENG201', dueDate: addDaysToISO(12), estHours:6, selfStress:3, createdAt:new Date().toISOString() },
    { id:'demo3', title:'Project Presentation', course:'CS300', dueDate: addDaysToISO(3), estHours:20, selfStress:5, createdAt:new Date().toISOString() },
  ];
  saveAndRender();
}

function addDaysToISO(n){
  const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10);
}
