<?php
// Database connection
$host = "localhost";
$user = "root";     // MySQL username (XAMPP default = root)
$pass = "";         // MySQL password (XAMPP default = empty)
$db   = "counselling_db";

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("<div class='container error'>Connection failed: " . $conn->connect_error . "</div>");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Booking Status</title>
  <style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
    }
    .container {
        background: #fff;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        padding: 35px 45px;
        max-width: 550px;
        text-align: center;
        animation: fadeIn 0.8s ease-in-out;
    }
    h2 {
        color: #2575fc;
        margin-bottom: 15px;
        font-size: 26px;
    }
    p {
        font-size: 17px;
        margin: 10px 0;
    }
    a {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 25px;
        text-decoration: none;
        color: #fff;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        border-radius: 30px;
        transition: 0.3s;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    a:hover {
        background: linear-gradient(135deg, #2575fc, #6a11cb);
        transform: scale(1.05);
    }
    .error {
        border-left: 6px solid red;
        padding-left: 12px;
        color: #d40000;
        font-weight: bold;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $counsellor   = $_POST['counsellor']   ?? '';
    $studentName  = $_POST['studentName']  ?? '';
    $date         = $_POST['date']         ?? '';
    $time         = $_POST['time']         ?? '';

    if ($counsellor && $studentName && $date && $time) {
        $sql = "INSERT INTO bookings (counsellor_name, student_name, booking_date, booking_time) 
                VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $counsellor, $studentName, $date, $time);

        if ($stmt->execute()) {
            echo "<div class='container'>
                    <h2>✅ Booking Confirmed!</h2>
                    <p><strong>Counsellor:</strong> $counsellor</p>
                    <p><strong>Your Name:</strong> $studentName</p>
                    <p><strong>Date:</strong> $date</p>
                    <p><strong>Time:</strong> $time</p>
                    <a href='home.html'>⬅ Back to Home</a>
                  </div>";
        } else {
            echo "<div class='container error'>❌ Error: " . $stmt->error . "</div>";
        }

        $stmt->close();
    } else {
        echo "<div class='container error'>⚠️ Missing required form fields!</div>";
    }
} else {
    echo "<div class='container error'>⚠️ Please submit the form.</div>";
}

$conn->close();
?>
</body>
</html>
