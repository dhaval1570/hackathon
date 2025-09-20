const tasks = document.querySelectorAll(".task");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const leaves = document.getElementById("leaves");
const treeMessage = document.getElementById("treeMessage");
const streakEl = document.getElementById("streak");

let streak = localStorage.getItem("streak") || 0;
streakEl.textContent = streak;

function updateProgress() {
  const completed = document.querySelectorAll(".task:checked").length;
  const total = tasks.length;
  const percent = (completed / total) * 100;
  
  progressFill.style.width = percent + "%";
  progressText.textContent = `${completed} / ${total} activities completed`;

  // Tree growth stages
  leaves.className = "leaves";
  if (completed >= 1) leaves.classList.add("grown-1");
  if (completed >= 2) leaves.classList.add("grown-2");
  if (completed >= 3) leaves.classList.add("grown-3");
  if (completed === 4) {
    leaves.classList.add("grown-4");
    treeMessage.textContent = "🌳 Amazing! Your tree is fully grown today!";
    incrementStreak();
  } else if (completed > 0) {
    treeMessage.textContent = "🌱 Keep going, your tree is growing!";
  } else {
    treeMessage.textContent = "Complete activities to grow your tree!";
  }
}

function incrementStreak() {
  if (localStorage.getItem("lastCompletion") !== new Date().toDateString()) {
    streak++;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompletion", new Date().toDateString());
    streakEl.textContent = streak;
  }
}

tasks.forEach(task => task.addEventListener("change", updateProgress));

// Initialize
updateProgress();
