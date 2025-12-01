<?php
require_once 'config.php';

// Настройки для отправки email
$admin_email = "admin@fabulous-sweetness.ru";
$site_name = "Fabulous Sweetness";

// Получение данных из формы
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;
}

if (!$data) {
    $data = $_POST;
}

// Определение типа формы
$form_type = isset($data['form_type']) ? $data['form_type'] : 'order';

// Подключение к БД
$conn = getDBConnection();

if ($form_type === 'order') {
    // Обработка формы заказа
    
    // Валидация данных
    $errors = [];
    
    if (empty($data['name'])) {
        $errors[] = "Имя обязательно для заполнения";
    }
    
    if (empty($data['phone'])) {
        $errors[] = "Телефон обязателен для заполнения";
    }
    
    if (empty($data['address'])) {
        $errors[] = "Адрес доставки обязателен для заполнения";
    }
    
    if (empty($data['date'])) {
        $errors[] = "Дата доставки обязательна для заполнения";
    }
    
    // Если есть ошибки, возвращаем их
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Сохранение заказа в БД
    $customer_name = $conn->real_escape_string($data['name']);
    $customer_phone = $conn->real_escape_string($data['phone']);
    $customer_email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
    $delivery_address = $conn->real_escape_string($data['address']);
    $delivery_date = $conn->real_escape_string($data['date']);
    $delivery_time = isset($data['time']) ? $conn->real_escape_string($data['time']) : '';
    $comment = isset($data['comment']) ? $conn->real_escape_string($data['comment']) : '';
    
    // В реальном приложении здесь будет расчет суммы из корзины
    $total_amount = isset($data['total']) ? $data['total'] : 0;
    
    // Вставка заказа
    $sql = "INSERT INTO orders (customer_name, customer_phone, customer_email, delivery_address, delivery_date, delivery_time, comment, total_amount) 
            VALUES ('$customer_name', '$customer_phone', '$customer_email', '$delivery_address', '$delivery_date', '$delivery_time', '$comment', '$total_amount')";
    
    if ($conn->query($sql) === TRUE) {
        $order_id = $conn->insert_id;
        
        // Отправка email
        $subject = "Новый заказ #$order_id на сайте $site_name";
        $message = "Поступил новый заказ:\n\n";
        $message .= "Номер заказа: #$order_id\n";
        $message .= "Имя клиента: $customer_name\n";
        $message .= "Телефон: $customer_phone\n";
        $message .= "Email: $customer_email\n";
        $message .= "Адрес доставки: $delivery_address\n";
        $message .= "Дата доставки: $delivery_date\n";
        $message .= "Время доставки: $delivery_time\n";
        $message .= "Комментарий: $comment\n";
        $message .= "Сумма заказа: $total_amount ₽\n";
        
        $headers = "From: $site_name <no-reply@fabulous-sweetness.ru>\r\n";
        $headers .= "Reply-To: $admin_email\r\n";
        $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Отправка email администратору
        mail($admin_email, $subject, $message, $headers);
        
        // Отправка email клиенту (если указан email)
        if ($customer_email) {
            $client_subject = "Ваш заказ #$order_id в $site_name";
            $client_message = "Уважаемый(ая) $customer_name,\n\n";
            $client_message .= "Благодарим вас за заказ в нашей кондитерской!\n\n";
            $client_message .= "Детали заказа:\n";
            $client_message .= "Номер заказа: #$order_id\n";
            $client_message .= "Адрес доставки: $delivery_address\n";
            $client_message .= "Дата доставки: $delivery_date\n";
            $client_message .= "Время доставки: $delivery_time\n";
            $client_message .= "Сумма заказа: $total_amount ₽\n\n";
            $client_message .= "Мы свяжемся с вами в ближайшее время для подтверждения заказа.\n\n";
            $client_message .= "С уважением,\nКоманда Fabulous Sweetness";
            
            mail($customer_email, $client_subject, $client_message, $headers);
        }
        
        echo json_encode(['success' => true, 'message' => 'Заказ успешно оформлен!', 'order_id' => $order_id]);
    } else {
        echo json_encode(['success' => false, 'errors' => ['Ошибка при сохранении заказа: ' . $conn->error]]);
    }
    
} elseif ($form_type === 'contact') {
    // Обработка формы обратной связи
    
    // Валидация данных
    $errors = [];
    
    if (empty($data['name'])) {
        $errors[] = "Имя обязательно для заполнения";
    }
    
    if (empty($data['email'])) {
        $errors[] = "Email обязателен для заполнения";
    }
    
    if (empty($data['message'])) {
        $errors[] = "Сообщение обязательно для заполнения";
    }
    
    // Если есть ошибки, возвращаем их
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Сохранение сообщения в БД
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $subject = isset($data['subject']) ? $conn->real_escape_string($data['subject']) : '';
    $message = $conn->real_escape_string($data['message']);
    
    $sql = "INSERT INTO messages (name, email, subject, message) 
            VALUES ('$name', '$email', '$subject', '$message')";
    
    if ($conn->query($sql) === TRUE) {
        // Отправка email
        $email_subject = "Новое сообщение с сайта $site_name";
        if ($subject) {
            $email_subject .= ": $subject";
        }
        
        $email_message = "Поступило новое сообщение с формы обратной связи:\n\n";
        $email_message .= "Имя: $name\n";
        $email_message .= "Email: $email\n";
        if ($subject) {
            $email_message .= "Тема: $subject\n";
        }
        $email_message .= "Сообщение:\n$message\n";
        
        $headers = "From: $site_name <no-reply@fabulous-sweetness.ru>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Отправка email администратору
        mail($admin_email, $email_subject, $email_message, $headers);
        
        echo json_encode(['success' => true, 'message' => 'Сообщение успешно отправлено!']);
    } else {
        echo json_encode(['success' => false, 'errors' => ['Ошибка при сохранении сообщения: ' . $conn->error]]);
    }
}

// Закрытие соединения с БД
closeDBConnection($conn);
?>