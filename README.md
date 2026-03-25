# Общение Христиан — сайт церкви

[![Last Commit](https://img.shields.io/github/last-commit/exeshkin/uliyanovsk.ru)](https://github.com/exeshkin/uliyanovsk.ru/commits/main)
[![License](https://img.shields.io/badge/license-proprietary-blue)]()

**Официальный сайт христианской церкви «Общение Христиан» в Ульяновске**

🌐 **Основной домен:** [uliyanovsk.ru](https://uliyanovsk.ru)

---

## 📖 О проекте

Статический веб-сайт с элементами динамического контента через JSON и PHP. Сайт предоставляет информацию о церкви, включая:

- 📖 **Проповеди и послания** (1500+ записей с 1947 года)
- 🎵 **Музыка и псалмы**
- 📸 **Фотогалерея** событий и встреч
- 🎬 **Видео** богослужений и обзоров
- 📡 **Онлайн-трансляции** богослужений (RTMP + HLS)

---

## 🚀 Быстрый старт

### Локальная разработка (SSI сервер)

Сайт использует **SSI (Server Side Includes)** для подключения header/footer. Обычные статические серверы не подойдут.

**Windows:**
```bash
# Дважды кликните на start-server.bat
# ИЛИ в командной строке:
python server.py
```

**Любая ОС:**
```bash
cd site_2026_v4
python server.py
```

**Доступ:** http://localhost:8080

### Альтернативы (без SSI)

Если SSI не нужен (например, для просмотра статических страниц):

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

---

## 📁 Структура проекта

```
uliyanovsk.ru/
├── index.html              # Главная страница
├── contacts.html           # Контакты
├── services.html           # Проповеди (служение)
├── message.html            # Страница послания
├── message-years-*.html    # Послания по периодам (1947-1965)
├── worship.html            # Поклонение
├── photo.html              # Фото статьи
├── photo-list.html         # Список фотоальбомов
├── video.html              # Видео статьи
├── video-list.html         # Список видео
├── streamvideo.html        # Страница трансляции
├── minister-*.html         # Страницы служителей
├── psalms-*.html           # Псалмы по годам (2024, 2025, 2026)
├── sendmail.php            # Обработчик формы обратной связи
├── sitemap.xml             # Карта сайта
│
├── css/                    # Стили (16 файлов)
│   ├── style.css           # Основные стили
│   ├── search.css          # Поиск
│   ├── password.css        # Модальное окно пароля
│   ├── notify.css          # Уведомления
│   └── ...
│
├── js/                     # JavaScript модули
│   ├── index.js            # Главный скрипт инициализации
│   ├── search.js           # Поиск по сайту
│   ├── video.js            # Видео плеер
│   ├── streamvideo.js      # Стриминг
│   ├── modules/            # Модули (header, menu, etc.)
│   ├── utils/              # Утилиты (getDataJson, getDate, etc.)
│   ├── hls/                # HLS библиотека
│   ├── lightgallery/       # Галерея
│   └── select2/            # Select2 плагин
│
├── data/                   # JSON данные (контент обновляется через админку)
│   ├── message.json        # Послания (1500+ записей с 1947 года)
│   ├── services.json       # Проповеди/служения
│   ├── ministers.json      # Служители
│   ├── gallery.json        # Галерея фото/видео
│   ├── notify.json         # Уведомления
│   ├── psalms.json         # Псалмы
│   ├── music.json          # Музыка
│   └── stream.json         # Настройки стрима
│
├── includes/               # SSI включения (header, footer)
│   ├── header.html
│   └── footer.html
│
├── img/                    # Изображения
├── fonts/                  # Шрифты (Exo2)
├── files/                  # Файлы для скачивания
├── video-stream/           # HLS потоки (открытые)
├── video-closed/           # HLS потоки (закрытые)
├── docs/errors/            # Страницы ошибок (404)
└── phpmailer/              # PHPMailer библиотека
```

---

## 🛠 Технологии

### Frontend
| Технология | Назначение |
|------------|------------|
| **HTML5** | Семантическая вёрстка |
| **CSS3** | Кастомные стили, адаптивный дизайн (mobile-first) |
| **JavaScript (ES6 Modules)** | Модульная архитектура |
| **HLS.js** | HTTP Live Streaming для видео |
| **LightGallery** | Галерея изображений |
| **Select2** | Улучшенные select-элементы |

### Backend
| Технология | Назначение |
|------------|------------|
| **PHP 8.3** | Обработка форм, FPM |
| **PHPMailer** | Отправка email через SMTP (Yandex) |
| **NGINX** | Веб-сервер + RTMP модуль для стриминга |
| **FFmpeg** | Транскодинг видео в реальном времени (720p → 480p, 360p) |

### Инфраструктура
| Технология | Назначение |
|------------|------------|
| **SSL/TLS** | Let's Encrypt (TLSv1.2, TLSv1.3) |
| **RTMP** | Потоковое вещание (порт 1935) |
| **HLS** | Адаптивный стриминг (.m3u8, .ts) |

---

## 📡 RTMP стриминг

```
RTMP (порт 1935) → FFmpeg транскодинг → HLS (.m3u8)
                                          ↓
                          /video-stream/ (открытый)
                          /video-closed/ (закрытый)
```

**HLS варианты:**
- 720p @ 3000k
- 480p @ 1200k
- 360p @ 600k

---

## 🔑 Ключевые файлы

### `nginx.conf`
- **HTTP → HTTPS редирект** (301)
- **Безопасность:** HSTS, X-Frame-Options, CSP, Referrer-Policy
- **Кэширование:** 
  - HTML/JS/CSS — no-cache (версия в query string)
  - Изображения/шрифты — 30 дней
  - Медиа (MP3/MP4) — 7 дней
  - HLS (.m3u8, .ts) — no-cache
- **RTMP конфигурация:**
  - `liveStream` — открытый поток с транскодингом
  - `liveStreamClosed` — закрытый поток

### `js/index.js`
Инициализирует:
- Загрузку данных из JSON (services, message, gallery)
- Отображение последней проповеди на главной
- Сетку посланий (6 случайных из message.json)
- Последнее событие (фото или видео)
- Уведомления (из notify.json)
- Проверку доступа к сайту (пароль)

### `sendmail.php`
Обработчик контактной формы:
- SMTP: `smtp.yandex.ru:587` (TLS)
- Отправитель: `anir.u@yandex.ru`
- Секретная проверка: `secretkey === 'BIGSecret'`

### JSON данные
- **message.json** — 1500+ посланий (1947-1965), Уилльям Бранхам
- **services.json** — проповеди служителей (Анатолий Склонный, Илья Акатов, и др.)
- **ministers.json** — список служителей с путями к медиа
- **gallery.json** — фотоальбомы и видео-обзоры

---

## 🏗 Архитектурные особенности

### SSI (Server Side Includes)
Header и footer подключаются через SSI:
```html
<!--# include file="includes/header.html" -->
<!--# include file="includes/footer.html" -->
```

### Динамический хедер
`js/modules/header.js` рендерит шапку динамически из `ministers.json`, позволяя обновлять меню без изменения HTML.

### Пароль на сайт
Модальное окно пароля (`js/modules/websiteAccess.js`) — доступ по паролю через localStorage.

### HLS стриминг
```
RTMP (порт 1935) → FFmpeg транскодинг → HLS (.m3u8)
                                          ↓
                          /video-stream/ (открытый)
                          /video-closed/ (закрытый)
```

### Поиск по сайту
`js/search.js` — поиск по `services.json` и `message.json` с фильтрацией по имени служителя и названию.

---

## 🔄 Обновление контента

Контент обновляется через FTP/админку:

1. **Проповеди:** Добавить запись в `services.json`, загрузить MP4/WebP
2. **Послания:** Добавить в `message.json`, загрузить MP3
3. **Уведомления:** Изменить `notify.json` (`on: "true"`, дата, изображение)
4. **Галерея:** Обновить `gallery.json`

---

## 🔒 Безопасность

- **CSP:** Разрешены только `self`, Yandex.Metrika, RuTube
- **HTTPS:** Принудительный редирект с HTTP
- **Доступ к includes:** Запрещён через nginx (`deny all`)
- **Пароль на сайт:** Модальное окно с проверкой через localStorage

---

## 📞 Контакты

| Тип | Значение |
|-----|----------|
| **Email** | `site@uliyanovsk.ru` |
| **SMTP** | `anir.u@yandex.ru` (через PHPMailer) |
| **Домен** | `uliyanovsk.ru` |

---

## 📝 Внесение изменений

Для внесения изменений в проект:

```bash
# Внесите изменения в файлы
git add .
git commit -m "Описание изменений"
git push
```

---

## ⚠️ Примечание

**Этот репозиторий не содержит медиафайлы (mp3, mp4)** из-за их большого размера. Медиафайлы хранятся на сервере и загружаются через админку/FTP.

Для локальной разработки достаточно:
- ✅ HTML/CSS/JS файлы
- ✅ JSON данные
- ✅ Изображения (webp, svg, png)
- ✅ Шрифты

---

## 📄 Лицензия

Проект является собственностью церкви «Общение Христиан» (Ульяновск).

---

**© 2026 Общение Христиан. Все права защищены.**
