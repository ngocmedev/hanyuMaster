<?php
// api/init_db.php

require_once 'config.php';

// First, connect without selecting a database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists.<br>";
} else {
    die("Error creating database: " . $conn->error);
}

$conn->select_db(DB_NAME);

// Drop the old table to upgrade schema
$conn->query("DROP TABLE IF EXISTS sentence_patterns");

// Create table for sentence patterns
$sql = "CREATE TABLE sentence_patterns (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    deck_name VARCHAR(100) NOT NULL,
    chinese_sentence VARCHAR(255) NOT NULL,
    pinyin VARCHAR(255) NOT NULL,
    vietnamese_meaning VARCHAR(255) NOT NULL,
    words_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table sentence_patterns created successfully.<br>";
} else {
    die("Error creating table: " . $conn->error);
}

// Insert sample data
echo "Inserting sample patterns...<br>";

$patterns = [
    // City
    ['deck_name' => 'City', 'chinese_sentence' => '这座城市非常繁华。', 'pinyin' => 'Zhè zuò chéngshì fēicháng fánhuá.', 'vietnamese_meaning' => 'Thành phố này rất sầm uất.', 'words_json' => '["这座", "城市", "非常", "繁华", "。"]'],
    ['deck_name' => 'City', 'chinese_sentence' => '市中心的交通很拥挤。', 'pinyin' => 'Shì zhōngxīn de jiāotōng hěn yōngjǐ.', 'vietnamese_meaning' => 'Giao thông ở trung tâm thành phố rất đông đúc.', 'words_json' => '["市中心", "的", "交通", "很", "拥挤", "。"]'],
    // Countryside
    ['deck_name' => 'Countryside', 'chinese_sentence' => '乡下的空气很清新。', 'pinyin' => 'Xiāngxià de kōngqì hěn qīngxīn.', 'vietnamese_meaning' => 'Không khí ở nông thôn rất trong lành.', 'words_json' => '["乡下", "的", "空气", "很", "清新", "。"]'],
    // Education
    ['deck_name' => 'Education', 'chinese_sentence' => '我对教育学很感兴趣。', 'pinyin' => 'Wǒ duì jiàoyù xué hěn gǎn xìngqù.', 'vietnamese_meaning' => 'Tôi rất hứng thú với ngành giáo dục.', 'words_json' => '["我", "对", "教育学", "很", "感兴趣", "。"]'],
    // Environment
    ['deck_name' => 'Environment', 'chinese_sentence' => '我们要保护环境。', 'pinyin' => 'Wǒmen yào bǎohù huánjìng.', 'vietnamese_meaning' => 'Chúng ta phải bảo vệ môi trường.', 'words_json' => '["我们", "要", "保护", "环境", "。"]'],
    // Health
    ['deck_name' => 'Health', 'chinese_sentence' => '运动对身体健康很好。', 'pinyin' => 'Yùndòng duì shēntǐ jiànkāng hěn hǎo.', 'vietnamese_meaning' => 'Tập thể dục rất tốt cho sức khỏe.', 'words_json' => '["运动", "对", "身体", "健康", "很", "好", "。"]'],
    // Hobby
    ['deck_name' => 'Hobby', 'chinese_sentence' => '我的爱好是听音乐。', 'pinyin' => 'Wǒ de àihào shì tīng yīnyuè.', 'vietnamese_meaning' => 'Sở thích của tôi là nghe nhạc.', 'words_json' => '["我", "的", "爱好", "是", "听音乐", "。"]'],
    // Holiday
    ['deck_name' => 'Holiday', 'chinese_sentence' => '祝你假期愉快。', 'pinyin' => 'Zhù nǐ jiàqī yúkuài.', 'vietnamese_meaning' => 'Chúc bạn kỳ nghỉ vui vẻ.', 'words_json' => '["祝", "你", "假期", "愉快", "。"]'],
    // House
    ['deck_name' => 'House', 'chinese_sentence' => '他买了一套新房子。', 'pinyin' => 'Tā mǎi le yī tào xīn fángzi.', 'vietnamese_meaning' => 'Anh ấy đã mua một căn nhà mới.', 'words_json' => '["他", "买", "了", "一", "套", "新", "房子", "。"]'],
    // Job and Study
    ['deck_name' => 'Job and Study', 'chinese_sentence' => '她一边工作一边学习。', 'pinyin' => 'Tā yībiān gōngzuò yībiān xuéxí.', 'vietnamese_meaning' => 'Cô ấy vừa làm việc vừa học.', 'words_json' => '["她", "一边", "工作", "一边", "学习", "。"]'],
    // Learning foreign languages
    ['deck_name' => 'Learning foreign languages', 'chinese_sentence' => '学外语需要很多练习。', 'pinyin' => 'Xué wàiyǔ xūyào hěn duō liànxí.', 'vietnamese_meaning' => 'Học ngoại ngữ cần luyện tập rất nhiều.', 'words_json' => '["学", "外语", "需要", "很", "多", "练习", "。"]'],
    // Relationship
    ['deck_name' => 'Relationship', 'chinese_sentence' => '我们是好朋友。', 'pinyin' => 'Wǒmen shì hǎo péngyou.', 'vietnamese_meaning' => 'Chúng tôi là bạn tốt.', 'words_json' => '["我们", "是", "好", "朋友", "。"]'],
    // Technology
    ['deck_name' => 'Technology', 'chinese_sentence' => '现代科技发展很快。', 'pinyin' => 'Xiàndài kējì fāzhǎn hěn kuài.', 'vietnamese_meaning' => 'Công nghệ hiện đại phát triển rất nhanh.', 'words_json' => '["现代", "科技", "发展", "很", "快", "。"]'],
    // Travel/Transport
    ['deck_name' => 'Travel/Transport', 'chinese_sentence' => '坐高铁去旅行很方便。', 'pinyin' => 'Zuò gāotiě qù lǚxíng hěn fāngbiàn.', 'vietnamese_meaning' => 'Đi du lịch bằng tàu cao tốc rất thuận tiện.', 'words_json' => '["坐", "高铁", "去", "旅行", "很", "方便", "。"]'],
    // Weather
    ['deck_name' => 'Weather', 'chinese_sentence' => '今天天气非常好。', 'pinyin' => 'Jīntiān tiānqì fēicháng hǎo.', 'vietnamese_meaning' => 'Hôm nay thời tiết rất tốt.', 'words_json' => '["今天", "天气", "非常", "好", "。"]'],
    // Work
    ['deck_name' => 'Work', 'chinese_sentence' => '老板今天安排了很多工作。', 'pinyin' => 'Lǎobǎn jīntiān ānpái le hěn duō gōngzuò.', 'vietnamese_meaning' => 'Sếp hôm nay đã sắp xếp rất nhiều công việc.', 'words_json' => '["老板", "今天", "安排", "了", "很", "多", "工作", "。"]']
];

$stmt = $conn->prepare("INSERT INTO sentence_patterns (deck_name, chinese_sentence, pinyin, vietnamese_meaning, words_json) VALUES (?, ?, ?, ?, ?)");
foreach ($patterns as $pattern) {
    $stmt->bind_param("sssss", $pattern['deck_name'], $pattern['chinese_sentence'], $pattern['pinyin'], $pattern['vietnamese_meaning'], $pattern['words_json']);
    $stmt->execute();
}

echo "Sample data inserted successfully.<br>";

$conn->close();

echo "<br><strong>Initialization completed successfully!</strong>";
echo "<br><a href='../index.html'>Go back to HanyuMaster</a>";
?>
