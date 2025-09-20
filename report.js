// Load report from localStorage
const reportData = JSON.parse(localStorage.getItem("mh_quiz_result"));
const reportCard = document.getElementById("reportCard");

if(reportData){
  const { total, severity, label, date } = reportData;

  reportCard.innerHTML = `
    <h2>Your Results</h2>
    <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
    <p><strong>Total Score:</strong> ${total}</p>
    <p class="severity ${severity}"><strong>Condition:</strong> ${label}</p>
    <p><em>This result is not a diagnosis. Please reach out to a counselor or professional if you have concerns.</em></p>
  `;
} else {
  reportCard.innerHTML = `
    <h2>No Report Found</h2>
    <p>Please take the quiz first to see your report.</p>
  `;
}
