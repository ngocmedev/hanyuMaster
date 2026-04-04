<?php
// api/get_decks.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow local origins if accessed across separate domains

require_once 'config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

$sql = "SELECT deck_name, COUNT(*) as word_count FROM sentence_patterns GROUP BY deck_name ORDER BY deck_name ASC";
$result = $conn->query($sql);

$decks = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $decks[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'data' => $decks
]);

$conn->close();
?>
