# Общение Христиан — сайт церкви (uliyanovsk.ru)

## Обзор проекта

**Официальный сайт христианской церкви «Общение Христиан» в Ульяновске**

Статический веб-сайт с элементами динамического контента через JSON и PHP. Сайт предоставляет информацию о церкви, включая проповеди, послания, фото/видео материалы, и функционал онлайн-трансляции богослужений.

**Основной домен:** `uliyanovsk.ru`

## 📅 Отчёт о работе (24 марта 2026)

### Созданные файлы
| Файл | Назначение |
|------|------------|
| `server.py` | Локальный SSI-сервер на Python (эмуляция nginx) |
| `start-server.bat` | Ярлык для запуска сервера на Windows |
| `QWEN.md` | Документация проекта |

### Исправленные ошибки

#### 1. Несогласованность версий CSS
**Проблема:** Разные версии CSS в файлах (`v=20260303` vs `v=20260324`)  
**Решение:** Унифицирована версия `v=20260324` во всех файлах:
- `psalms-2023.html`, `psalms-2024.html`, `psalms-2025.html`, `worship.html`, `index.html`

#### 2. FOUC в Firefox (Flash Of Unstyled Content)
**Проблема:** На `index.html` стили мигали при загрузке  
**Решение:** CSS перемещён **выше** скрипта Yandex.Metrika

#### 3. Race condition в видеоплеерах
**Проблема:** Видео и скрины не загружались на `worship.html`, `psalms-202x.html`  
**Решение:** Переписаны файлы с проверками элементов:
- `psalms-video.js` — добавлены проверки `vidInMain`, `titleInMain`, фильтрация по `hasVideo`
- `music-video.js` — добавлены проверки элементов
- `worship.js` — расшифрован из минификации, добавлена обработка ошибок

#### 4. Обработка ошибок в getDataJson.js
**Проблема:** При ошибке загрузки JSON пользователь не видел сообщения  
**Решение:** Добавлено отображение ошибок в UI, параметр `useCache`

#### 5. Кэширование в getDataJson.js
**Проблема:** Cache-buster добавлялся всегда, кэш не работал  
**Решение:** Добавлен параметр `useCache = false` (по умолчанию)

#### 6. Мёртвый CSS код
**Проблема:** Неиспользуемые классы `.error-fzf` в `style.css`  
**Решение:** Удалены все упоминания `.error-fzf`, `.error-fzf__btn`, `.error-fzf__info`

#### 7. Потенциальная XSS в search.js
**Проблема:** Пользовательский ввод вставлялся через `innerHTML`  
**Решение:** Переписан на `textContent`, добавлена функция `escapeHtml`

### Исследованные проблемы (не исправлены)
- **Разная ширина видео на psalms-202x.html @1400px+:** Причина — постеры к видео имеют разные размеры. Требуется унификация изображений.

## Структура проекта

```
site_2026_v3/
├── nginx.conf              # Конфигурация NGINX + RTMP для стриминга
├── server.py               # Локальный SSI сервер (Python)
├── start-server.bat        # Ярлык для запуска сервера (Windows)
└── uliyanovsk.ru/          # Корневая директория сайта
    ├── index.html          # Главная страница
    ├── contacts.html       # Контакты
    ├── services.html       # Проповеди (служение)
    ├── message.html        # Страница послания
    ├── message-years-*.html # Послания по периодам (1947-1957, 1958-1962, 1963-1965)
    ├── worship.html        # Поклонение
    ├── photo.html          # Фото статьи
    ├── photo-list.html     # Список фотоальбомов
    ├── video.html          # Видео статьи
    ├── video-list.html     # Список видео
    ├── streamvideo.html    # Страница трансляции
    ├── minister-*.html     # Страницы служителей
    ├── psalms-*.html       # Псалмы по годам
    ├── sendmail.php        # Обработчик формы обратной связи
    ├── sitemap.xml         # Карта сайта
    │
    ├── css/                # Стили (16 файлов)
    │   ├── style.css       # Основные стили
    │   ├── search.css      # Поиск
    │   ├── password.css    # Модальное окно пароля
    │   ├── notify.css      # Уведомления
    │   └── ...
    │
    ├── js/                 # JavaScript модули
    │   ├── index.js        # Главный скрипт инициализации
    │   ├── search.js       # Поиск по сайту
    │   ├── video.js        # Видео плеер
    │   ├── streamvideo.js  # Стриминг
    │   ├── modules/        # Модули (header, menu, etc.)
    │   ├── utils/          # Утилиты (getDataJson, getDate, etc.)
    │   ├── hls/            # HLS библиотека
    │   ├── lightgallery/   # Галерея
    │   └── select2/        # Select2 плагин
    │
    ├── data/               # JSON данные (контент обновляется через админку)
    │   ├── message.json    # Послания (1500+ записей с 1947 года)
    │   ├── services.json   # Проповеди/служения
    │   ├── ministers.json  # Служители
    │   ├── gallery.json    # Галерея фото/видео
    │   ├── notify.json     # Уведомления
    │   ├── psalms.json     # Псалмы
    │   ├── music.json      # Музыка
    │   └── stream.json     # Настройки стрима
    │
    ├── includes/           # SSI включения (header, footer)
    │   ├── header.html
    │   └── footer.html
    │
    ├── img/                # Изображения
    ├── fonts/              # Шрифты (Exo2)
    ├── files/              # Файлы для скачивания
    ├── video-stream/       # HLS потоки (открытые)
    ├── video-closed/       # HLS потоки (закрытые)
    ├── docs/errors/        # Страницы ошибок (404)
    └── phpmailer/          # PHPMailer библиотека
```

## Технологии

### Frontend
- **HTML5** — семантическая вёрстка
- **CSS3** — кастомные стили, адаптивный дизайн (mobile-first)
- **JavaScript (ES6 Modules)** — модульная архитектура
- **HLS.js** — HTTP Live Streaming для видео
- **LightGallery** — галерея изображений
- **Select2** — улучшенные select-элементы

### Backend
- **PHP 8.3** — обработка форм, FPM
- **PHPMailer** — отправка email через SMTP (Yandex)
- **NGINX** — веб-сервер + RTMP модуль для стриминга
- **FFmpeg** — транскодинг видео в реальном времени (720p → 480p, 360p)

### Инфраструктура
- **SSL/TLS** — Let's Encrypt (TLSv1.2, TLSv1.3)
- **RTMP** — потоковое вещание (порт 1935)
- **HLS** — адаптивный стриминг (.m3u8, .ts)

## Сборка и запуск

### Локальная разработка (SSI сервер)

**Важно:** Сайт использует SSI (Server Side Includes) для подключения header/footer. Обычные статические серверы не подойдут.

**Windows:**
```bash
# Дважды кликните на start-server.bat
# ИЛИ в командной строке:
python server.py
```

**Любая ОС:**
```bash
cd site_2026_v3
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

### Production (NGINX)

```bash
# Проверка конфигурации
nginx -t

# Перезапуск
systemctl restart nginx

# Статус
systemctl status nginx
```

### RTMP стриминг

```bash
# Проверка RTMP
nginx -V 2>&1 | grep rtmp

# Перезапуск RTMP
systemctl restart nginx

# Статус стрима
curl http://localhost/stats
```

## Ключевые файлы

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
  - HLS варианты: 720p (3000k), 480p (1200k), 360p (600k)

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

## Архитектурные особенности

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

## Практики разработки

### Код-стайл
- **CSS:** Минифицирован в production (версии в query string: `?v=20260303`)
- **JS:** ES6 модули, минификация через сборку
- **HTML:** Семантическая вёрстка, BEM-подобный нейминг

### Версионирование
Все статические ресурсы имеют версию в query string:
```html
<link rel="stylesheet" href="css/style.css?v=20260303">
<script src="js/index.js?v=20260303"></script>
```

### Безопасность
- **CSP:** Разрешены только `self`, Yandex.Metrika, RuTube
- **HTTPS:** Принудительный редирект с HTTP
- **Доступ к includes:** Запрещён через nginx (`deny all`)

## Обновление контента

Контент обновляется через FTP/админку:
1. **Проповеди:** Добавить запись в `services.json`, загрузить MP4/WebP
2. **Послания:** Добавить в `message.json`, загрузить MP3
3. **Уведомления:** Изменить `notify.json` (`on: "true"`, дата, изображение)
4. **Галерея:** Обновить `gallery.json`

## Контакты

- **Email:** `site@uliyanovsk.ru`
- **SMTP:** `anir.u@yandex.ru` (через PHPMailer)
