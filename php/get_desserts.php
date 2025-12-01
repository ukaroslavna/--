<?php
require_once 'config.php';

// Подключение к БД
$conn = getDBConnection();

// Получение параметров
$category = isset($_GET['category']) ? $_GET['category'] : '';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;

// Формирование SQL-запроса
$sql = "SELECT * FROM desserts WHERE is_active = TRUE";

if ($category && $category !== 'all') {
    $category = $conn->real_escape_string($category);
    $sql .= " AND category = '$category'";
}

$sql .= " ORDER BY created_at DESC";

if ($limit > 0) {
    $sql .= " LIMIT $limit";
}

// Выполнение запроса
$result = $conn->query($sql);

$desserts = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $desserts[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'category' => $row['category'],
            'image_url' => $row['image_url']
        ];
    }
}

// Закрытие соединения с БД
closeDBConnection($conn);

// Возврат данных в формате JSON
header('Content-Type: application/json');
echo json_encode($desserts);
?>