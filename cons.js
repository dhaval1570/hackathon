function openModal(counsellorName) {
  document.getElementById("bookingModal").style.display = "block";
  document.getElementById("modalTitle").innerText = "Book Appointment with " + counsellorName;
  document.getElementById("counsellor").value = counsellorName; // save counsellor name
}

function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
}

  
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const counsellor = document.getElementById("bookingModal").getAttribute("data-counsellor");
    const student = document.getElementById("studentName").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
  
    fetch("book.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `counsellor=${encodeURIComponent(counsellor)}&student=${encodeURIComponent(student)}&date=${date}&time=${time}`
    })
      .then(response => response.text())
      .then(data => {
        alert(data);
        closeModal();
      });
  });
  