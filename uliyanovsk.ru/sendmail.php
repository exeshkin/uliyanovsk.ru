<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Загрузка переменных окружения из .env файла
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception('Файл .env не найден. Создайте .env по примеру .env.example');
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Пропуск комментариев
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value, '"\'');
        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
}

// Загружаем .env из корня сайта
loadEnv(__DIR__ . '/.env');

// Получаем настройки из переменных окружения
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.yandex.ru';
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpSecure = getenv('SMTP_SECURE') ?: 'tls';
$smtpUsername = getenv('SMTP_USERNAME');
$smtpPassword = getenv('SMTP_PASSWORD');
$mailFrom = getenv('MAIL_FROM') ?: 'anir.u@yandex.ru';
$mailFromName = getenv('MAIL_FROM_NAME') ?: 'Сайт "Общение Христиан"';
$mailTo = getenv('MAIL_TO') ?: 'anir.u@yandex.ru';
$secretKey = getenv('SECRET_KEY') ?: 'BIGSecret';

// Проверка наличия обязательных настроек
if (!$smtpUsername || !$smtpPassword) {
    http_response_code(500);
    echo json_encode(['message' => 'Ошибка конфигурации: не заданы SMTP_USERNAME или SMTP_PASSWORD в .env']);
    exit;
}

require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->isSMTP();
$mail->Host = $smtpHost;
$mail->SMTPAuth = true;
$mail->Username = $smtpUsername;
$mail->Password = $smtpPassword;
$mail->SMTPSecure = $smtpSecure;
$mail->Port = $smtpPort;

$mail->isHTML(true);
$mail->setFrom($mailFrom, $mailFromName);
$mail->addAddress($mailTo);
$mail->Subject = 'Сообщение с сайта';

$body = '<h1>Сообщение с сайта</h1>';
$body .= '<p><strong>Имя:</strong> ' . htmlspecialchars($_POST['name'] ?? '') . '</p>';
$body .= '<p><strong>E-mail:</strong> ' . htmlspecialchars($_POST['email'] ?? '') . '</p>';
$body .= '<p><strong>Тема:</strong> ' . htmlspecialchars($_POST['topic'] ?? '') . '</p>';
$body .= '<p><strong>Сообщение:</strong> ' . nl2br(htmlspecialchars($_POST['message'] ?? '')) . '</p>';
$mail->Body = $body;

// Секретная проверка
$secretkey = $_POST['secret'] ?? '';

if ($secretkey !== $secretKey) {
    http_response_code(403);
    echo json_encode(['message' => 'Ошибка проверки безопасности']);
    exit;
}

try {
    if (!$mail->send()) {
        http_response_code(500);
        $message = 'Ошибка сервера! Что-то пошло не так! Попробуйте написать нам позже...';
    } else {
        $message = 'Ваше сообщение отправлено! Спасибо!';
    }
} catch (Exception $e) {
    http_response_code(500);
    $message = 'Ошибка сервера: ' . $e->getMessage();
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
