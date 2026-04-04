<?php
// api/get_patterns.php

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

$deck = isset($_GET['deck']) ? $_GET['deck'] : '';

if (!empty($deck)) {
    $stmt = $conn->prepare("SELECT id, chinese_sentence, pinyin, vietnamese_meaning, words_json FROM sentence_patterns WHERE deck_name = ? ORDER BY RAND() LIMIT 20");
    $stmt->bind_param("s", $deck);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql = "SELECT id, chinese_sentence, pinyin, vietnamese_meaning, words_json FROM sentence_patterns ORDER BY RAND() LIMIT 20";
    $result = $conn->query($sql);
}

$patterns = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Decode the JSON words back into an array to serve it as structured data
        $row['words'] = json_decode($row['words_json']);
        unset($row['words_json']);
        $patterns[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'data' => $patterns
]);

$conn->close();
?>