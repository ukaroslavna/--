<?php
// Конфигурация базы данных
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'fabulous_sweetness');

// Подключение к базе данных
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Проверка соединения
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Установка кодировки
    $conn->set_charset("utf8");
    
    return $conn;
}

// Создание таблиц, если они не существуют
function createTablesIfNotExist($conn) {
    // Таблица десертов
    $sql = "CREATE TABLE IF NOT EXISTS desserts (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }
    
    // Таблица заказов
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        delivery_address TEXT NOT NULL,
        delivery_date DATE NOT NULL,
        delivery_time VARCHAR(50),
        comment TEXT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('new', 'processing', 'delivered', 'cancelled') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }
    
    // Таблица элементов заказа
    $sql = "CREATE TABLE IF NOT EXISTS order_items (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        order_id INT(11) NOT NULL,
        dessert_id INT(11) NOT NULL,
        dessert_name VARCHAR(255) NOT NULL,
        quantity INT(11) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )";
    
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }
    
    // Таблица сообщений обратной связи
    $sql = "CREATE TABLE IF NOT EXISTS messages (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }
}

// Инициализация базы данных
$conn = getDBConnection();
createTablesIfNotExist($conn);

// Закрытие соединения с БД
function closeDBConnection($conn) {
    $conn->close();
}
?>