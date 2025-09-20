<?php
session_start();
session_destroy();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Logging Out...</title>
  <style>
    /* Full-page background with animated gradient */
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(270deg, #6a11cb, #2575fc, #ff6b6b, #f06595);
      background-size: 800% 800%;
      animation: gradientShift 15s ease infinite;
      font-family: Arial, sans-serif;
      color: white;
      text-align: center;
    }

    @keyframes gradientShift {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }

    .container {
      background: rgba(0, 0, 0, 0.4);
      padding: 40px 60px;
      border-radius: 20px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      animation: fadeIn 1.5s ease;
    }

    @keyframes fadeIn {
      from {opacity: 0; transform: translateY(-20px);}
      to {opacity: 1; transform: translateY(0);}
    }

    h1 {
      margin-bottom: 15px;
      font-size: 2.5rem;
    }

    p {
      margin-bottom: 25px;
      font-size: 1.2rem;
    }

    .home-link img {
      width: 60px;
      height: 60px;
      transition: transform 0.3s ease;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
    }

    .home-link img:hover {
      transform: scale(1.1) rotate(5deg);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Logged Out Successfully</h1>
    <p>Thank you for visiting. Redirecting to home...</p>
    <a class="home-link" href="index.php">
      <!-- Replace with your own home logo -->
      <img src="home.png" alt="Home">
    </a>
  </div>

  <!-- Auto redirect after 3 seconds -->
  <script>
    setTimeout(() => {
      window.location.href = "index.php";
    }, 3000);
  </script>
</body>
</html>
