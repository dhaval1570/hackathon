const questions = [
  { text: 'Little interest or pleasure in doing things?' },
  { text: 'Feeling down, depressed, or hopeless?' },
  { text: 'Trouble falling or staying asleep, or sleeping too much?' },
  { text: 'Feeling tired or having little energy?' },
  { text: 'Poor appetite or overeating?' },
  { text: 'Feeling nervous, anxious, or on edge?' },
  { text: 'Not being able to stop or control worrying?' }
];

const options = [
  {label:'Not at all', val:0},
  {label:'Several days', val:1},
  {label:'More than half the days', val:2},
  {label:'Nearly every day', val:3}
];

let index=0;
const answers=new Array(questions.length).fill(null);

const qTotalEl=document.getElementById('qTotal');
const qIndexEl=document.getElementById('qIndex');
const questionArea=document.getElementById('questionArea');
const progressFill=document.querySelector('.progress > i');
const restartContainer=document.getElementById('restartContainer');
qTotalEl.textContent=questions.length;

function renderQuestion(){
  const q=questions[index];
  qIndexEl.textContent=index+1;
  progressFill.style.width=((index)/questions.length*100)+'%';
  restartContainer.style.display="none"; // hide restart while answering

  questionArea.innerHTML='';
  const qEl=document.createElement('div');
  qEl.className='question';
  qEl.textContent=q.text;
  questionArea.appendChild(qEl);

  const opts=document.createElement('div');
  opts.className='options';
  options.forEach((o,i)=>{
    const btn=document.createElement('div');
    btn.className='option';
    btn.textContent=o.label;
    if(answers[index]===i) btn.classList.add('selected');
    btn.onclick=()=>{answers[index]=i;renderQuestion();};
    opts.appendChild(btn);
  });
  questionArea.appendChild(opts);
}

function showResult(){
  const total=answers.reduce((s,v)=>s+(v!==null?v:0),0);
  let severity='good';
  let label='Low — maintain self-care';
  if(total>=10){severity='warning';label='Moderate — consider reaching out';}
  if(total>=15){severity='danger';label='High — consider professional support';}

  document.getElementById('quickScore').textContent=total;
  document.getElementById('severityLabel').textContent=label;
  document.getElementById('severityBox').className='severity '+severity;

  // 🔥 Save result to localStorage for report page
  localStorage.setItem("mh_quiz_result", JSON.stringify({
    date: new Date().toISOString(),
    total,
    severity,
    label
  }));

  // Show restart button
  restartContainer.style.display="flex";
  progressFill.style.width='100%';
}

document.getElementById('btnNext').onclick=()=>{
  if(index<questions.length-1){index++;renderQuestion();}
  else {showResult();}
};
document.getElementById('btnBack').onclick=()=>{if(index>0){index--;renderQuestion();}};
document.getElementById('btnSkip').onclick=()=>{if(index<questions.length-1){index++;renderQuestion();}else{showResult();}};
document.getElementById('btnRestart').onclick=()=>{
  index=0;
  answers.fill(null);
  renderQuestion();
  document.getElementById('quickScore').textContent='—';
  document.getElementById('severityLabel').textContent='Take the quiz to see results';
  document.getElementById('severityBox').className='severity';
};

renderQuestion();
