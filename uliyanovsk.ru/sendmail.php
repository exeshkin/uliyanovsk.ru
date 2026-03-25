<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->isSMTP();
$mail->Host = 'smtp.yandex.ru';
$mail->SMTPAuth = true;
$mail->Username = 'anir.u@yandex.ru';
$mail->Password = 'hdycbahktagdqywd';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->isHTML(true);
// От кого письмо
$mail->setFrom('anir.u@yandex.ru', 'Сайт "Общение Христиан"');
// Кому отправить
$mail->addAddress('anir.u@yandex.ru');
// Сообщение с сайта
$mail->Subject = 'Сообщение с сайта';
// Тело письма
$body = '<h1>Сообщение с сайта</h1>';
$body .= '<p><strong>Имя:</strong> ' . $_POST['name'] . '</p>';
$body .= '<p><strong>E-mail:</strong> ' . $_POST['email'] . '</p>';
$body .= '<p><strong>Тема:</strong> ' . $_POST['topic'] . '</p>';
$body .= '<p><strong>Сообщение:</strong> ' . $_POST['message'] . '</p>';
$mail->Body = $body;

// Секретка
$secretkey = $_POST['secret'];

// Отправка
if ($secretkey != 'BIGSecret') {
	return false;
} else {
	if (!$mail->send()) {
		$message = 'Ошибка сервера! Что-то пошло не так! Попробуйте написать нам позже...';
	} else {
		$message = 'Ваше сообщение отправлено! Спасибо!';
	}
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
