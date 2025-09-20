document.getElementById("quizForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let score = 0;
    for (let i = 1; i <= 10; i++) {
      const answer = document.querySelector(`input[name="q${i}"]:checked`);
      if (answer) {
        score += parseInt(answer.value);
      }
    }
  
    const result = document.getElementById("result");
    if (score <= 3) {
      result.textContent = "Your mental condition appears GOOD. Keep taking care of yourself!";
      result.style.color = "green";
    } else if (score <= 6) {
      result.textContent = "Your mental condition may need some attention. Consider healthy habits and support.";
      result.style.color = "orange";
    } else {
      result.textContent = "Your mental condition may be at risk. Please consider speaking with a mental health professional.";
      result.style.color = "red";
    }
  });
   function openInfo(topic) {
      window.location.href = `info.html?topic=${topic}`;
    }