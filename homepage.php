<?php
session_start();
include("connect.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homepage</title>
  
  <style>
    /* 🌈 Animated gradient background */
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(270deg, #6a11cb, #2575fc, #ff6b6b, #f06595);
      background-size: 800% 800%;
      animation: gradientShift 15s ease infinite;
      font-family: "Segoe UI", sans-serif;
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ✨ Centered welcome box */
    .container {
      background: rgba(255, 255, 255, 0.1);
      padding: 60px 80px;
      border-radius: 20px;
      backdrop-filter: blur(12px);
      text-align: center;
      color: white;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      animation: fadeIn 1.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 👋 Welcome text */
    .container p {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 40px;
      text-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }

    /* 🎨 Buttons */
    .btn {
      display: inline-block;
      margin: 10px;
      padding: 14px 28px;
      border-radius: 30px;
      font-size: 18px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      background: linear-gradient(135deg, #ff6b6b, #f06595);
      box-shadow: 0 6px 15px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
    }
    .btn:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 12px 25px rgba(0,0,0,0.4);
      background: linear-gradient(135deg, #f06595, #6a11cb);
    }
  </style>
</head>
<body>
  <div class="container">
    <p>
      Hello  
      <?php 
        if(isset($_SESSION['email'])){
          $email=$_SESSION['email'];
          $query=mysqli_query($conn, "SELECT users.* FROM `users` WHERE users.email='$email'");
          while($row=mysqli_fetch_array($query)){
              echo $row['firstName'].' '.$row['lastName'];
          }
        }
      ?>
      🙂
    </p>
    <a href="logout.php" class="btn">Logout</a>
    <a href="home.html" class="btn">Home</a>
  </div>
</body>
</html>
