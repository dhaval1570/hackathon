const entryText = document.getElementById("entryText");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("analysisResult");
const moodText = document.getElementById("moodText");
const entryList = document.getElementById("entryList");
const moodChartCanvas = document.getElementById("moodChart");
const ctx = moodChartCanvas.getContext("2d");

// Load previous data
let journalData = JSON.parse(localStorage.getItem("journalData")) || [];

// Simple sentiment word lists
const positiveWords = ["happy","good","great","awesome","love","excited","calm","peaceful","amazing"];
const negativeWords = ["sad","bad","tired","angry","upset","depressed","lonely","anxious","stressed"];

// Analyze mood from text
function analyzeMood(text) {
  let score = 0;
  const words = text.toLowerCase().split(/\W+/);

  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });

  if (score > 0) return { mood: "Positive 😊", color: "limegreen", value: 1 };
  if (score < 0) return { mood: "Negative 😟", color: "red", value: -1 };
  return { mood: "Neutral 😐", color: "orange", value: 0 };
}

// Save and display entry
function saveEntry() {
  const text = entryText.value.trim();
  if (!text) return;

  const analysis = analyzeMood(text);
  const today = new Date().toLocaleDateString();

  const entry = { date: today, text, mood: analysis.mood, value: analysis.value };
  journalData.push(entry);
  localStorage.setItem("journalData", JSON.stringify(journalData));

  // Show today's analysis
  resultSection.classList.remove("hidden");
  moodText.textContent = analysis.mood;
  moodText.style.color = analysis.color;

  // Add to history
  renderHistory();
  drawChart();
  entryText.value = "";
}

// Render history list
function renderHistory() {
  entryList.innerHTML = "";
  journalData.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `[${entry.date}] ${entry.mood} → ${entry.text}`;
    entryList.appendChild(li);
  });
}

// Draw simple trend chart
function drawChart() {
  ctx.clearRect(0,0,moodChartCanvas.width,moodChartCanvas.height);

  const values = journalData.map(e => e.value);
  const labels = journalData.map(e => e.date);

  if (values.length === 0) return;

  // Scale
  const maxHeight = moodChartCanvas.height - 40;
  const stepX = moodChartCanvas.width / values.length;

  ctx.beginPath();
  ctx.moveTo(20, maxHeight/2);
  values.forEach((val, i) => {
    const x = i * stepX + 30;
    const y = maxHeight/2 - val * 50 + 100;
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  values.forEach((val, i) => {
    const x = i * stepX + 30;
    const y = maxHeight/2 - val * 50 + 100;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI*2);
    ctx.fillStyle = val > 0 ? "limegreen" : val < 0 ? "red" : "orange";
    ctx.fill();
  });
}

analyzeBtn.addEventListener("click", saveEntry);

// Initialize UI
renderHistory();
drawChart();
