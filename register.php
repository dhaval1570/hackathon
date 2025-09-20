<?php 

include 'connect.php';

if(isset($_POST['signUp'])){
    $firstName = $_POST['fName'];
    $lastName  = $_POST['lName'];
    $email     = $_POST['email'];
    $password  = md5($_POST['password']);

    $checkEmail = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($checkEmail); 

    if($result->num_rows > 0){
        // Show error with animation + button
        echo "
        <html>
        <head>
          <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(270deg, #ff6b6b, #f06595, #6a11cb, #2575fc);
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
            .message-box {
              background: rgba(0,0,0,0.5);
              padding: 40px 60px;
              border-radius: 20px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.3);
              animation: fadeIn 1.5s ease;
            }
            @keyframes fadeIn {
              from {opacity: 0; transform: translateY(-20px);}
              to {opacity: 1; transform: translateY(0);}
            }
            h2 {
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              padding: 12px 25px;
              background: #2575fc;
              color: white;
              border-radius: 25px;
              text-decoration: none;
              font-weight: bold;
              transition: 0.3s;
            }
            .btn:hover {
              background: #6a11cb;
              transform: scale(1.05);
            }
          </style>
        </head>
        <body>
          <div class='message-box'>
            <h2>Email Address Already Exists !</h2>
            <a href='index11.php' class='btn'>Go Back</a>
          </div>
        </body>
        </html>
        ";
        exit();
    } else {
        $insertQuery = "INSERT INTO users(firstName,lastName,email,password)
                        VALUES ('$firstName','$lastName','$email','$password')";
        if($conn->query($insertQuery) === TRUE){
            header("Location: index.php");
            exit();
        } else {
            echo "Error: ".$conn->error;
        }
    }
}

if(isset($_POST['signIn'])){
   $email    = $_POST['email'];
   $password = md5($_POST['password']);
   
   $sql = "SELECT * FROM users WHERE email='$email' and password='$password'";
   $result = $conn->query($sql);
   if($result->num_rows > 0){
      session_start();
      $row = $result->fetch_assoc();
      $_SESSION['email'] = $row['email'];
      header("Location: homepage.php");
      exit();
   } else {
      // Error for login
      echo "
      <html>
      <head>
        <style>
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
          .message-box {
            background: rgba(0,0,0,0.5);
            padding: 40px 60px;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            animation: fadeIn 1.5s ease;
          }
          h2 { margin-bottom: 20px; }
          .btn {
            display: inline-block;
            padding: 12px 25px;
            background: #ff6b6b;
            color: white;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            transition: 0.3s;
          }
          .btn:hover {
            background: #f06595;
            transform: scale(1.05);
          }
        </style>
      </head>
      <body>
        <div class='message-box'>
          <h2>Not Found, Incorrect Email or Password</h2>
          <a href='index.php' class='btn'>Try Again</a>
        </div>
      </body>
      </html>
      ";
      exit();
   }
}
?>
