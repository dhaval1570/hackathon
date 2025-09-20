<?php
header("Content-Type: application/json");
$pdo = new PDO("mysql:host=localhost;dbname=mental_health","root","");

// Active users (last 30 days with check-ins)
$activeUsers = $pdo->query("SELECT COUNT(DISTINCT student_id) FROM checkins WHERE created_at > NOW() - INTERVAL 30 DAY")->fetchColumn();

// Flagged cases
$flaggedCases = $pdo->query("SELECT COUNT(*) FROM flags WHERE risk='High'")->fetchColumn();

// Interventions completed
$interventions = $pdo->query("SELECT COUNT(*) FROM interventions WHERE completed=1")->fetchColumn();

// Heatmap: average anxiety per department
$heatmap = $pdo->query("
  SELECT dept, AVG(anxiety_level) as avgLevel
  FROM students s
  JOIN checkins c ON s.id = c.student_id
  WHERE c.created_at > NOW() - INTERVAL 30 DAY
  GROUP BY dept
")->fetchAll(PDO::FETCH_ASSOC);

// Trends: daily average anxiety for last 30 days
$trends = $pdo->query("
  SELECT DATE(created_at) as day, AVG(anxiety_level) as avgLevel
  FROM checkins
  WHERE created_at > NOW() - INTERVAL 30 DAY
  GROUP BY day
  ORDER BY day
")->fetchAll(PDO::FETCH_ASSOC);

// Recent cases (last 20 flags)
$cases = $pdo->query("
  SELECT s.name, s.dept, f.risk, DATE(f.created_at) as date
  FROM flags f
  JOIN students s ON s.id=f.student_id
  ORDER BY f.created_at DESC
  LIMIT 20
")->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
echo json_encode([
  "activeUsers"=>$activeUsers,
  "flaggedCases"=>$flaggedCases,
  "interventions"=>$interventions,
  "heatmap"=>$heatmap,
  "trends"=>$trends,
  "cases"=>$cases
]);
?>
