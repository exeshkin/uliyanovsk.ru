# Админка сайта uliyanovsk.ru

Панель управления контентом сайта церкви «Общение Христиан».

---

## 🚀 Установка

### 1. Установка зависимостей

```bash
cd galaxy.uliyanovsk.ru
npm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

**Отредактируйте `.env`:**

```env
# Сгенерируйте новый секретный ключ!
# Команда для генерации: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=ваш_случайный_ключ_из_32_символов

# Путь к данным сайта
DATA_DIR=../uliyanovsk.ru/data

# Порт
PORT=3000
```

### 3. Установка пароля админки

При первом запуске пароль будет установлен автоматически (см. раздел "Первый вход").

### 4. Запуск

```bash
npm start
```

**Доступ:** http://localhost:3000

---

## 🔐 Первый вход

1. Откройте http://localhost:3000
2. Вас перенаправит на страницу входа
3. Введите **любой пароль** (минимум 8 символов)
4. Этот пароль сохранится как хэш в `data/config.json`
5. Используйте этот пароль для последующих входов

---

## 📁 Структура

```
galaxy.uliyanovsk.ru/
├── server.js           # Сервер Express
├── routes/
│   ├── auth.js         # Маршруты авторизации
│   └── data.js         # Маршруты работы с данными
├── public/             # Статические файлы админки
│   ├── index.html      # Главная админки
│   ├── login.html      # Страница входа
│   ├── css/            # Стили
│   └── js/             # Скрипты
├── data/
│   └── config.json     # Хэш пароля (НЕ КОММИТИТЬ!)
├── .env                # Переменные окружения (НЕ КОММИТИТЬ!)
├── .env.example        # Пример .env (можно коммитить)
├── .gitignore          # Игнорируемые файлы
└── package.json        # Зависимости
```

---

## 🔒 Безопасность

### Что НЕЛЬЗЯ коммитить в Git:

| Файл | Причина |
|------|---------|
| `.env` | Содержит SESSION_SECRET |
| `data/config.json` | Содержит хэш пароля |
| `node_modules/` | Зависимости |

### Что МОЖНО коммитить:

| Файл | Причина |
|------|---------|
| `server.js` | Код сервера без секретов |
| `routes/*.js` | Бизнес-логика |
| `public/**` | Интерфейс админки |
| `package.json` | Зависимости |
| `.env.example` | Шаблон без реальных секретов |

---

## 🛡 Настройка на сервере

### 1. Установка

```bash
# Клонирование репозитория
git clone https://github.com/exeshkin/uliyanovsk.ru.git
cd uliyanovsk.ru/galaxy.uliyanovsk.ru

# Установка зависимостей
npm install

# Создание .env
cp .env.example .env
nano .env  # Отредактируйте SESSION_SECRET
```

### 2. Запуск через PM2 (рекомендуется)

```bash
npm install -g pm2
pm2 start server.js --name galaxy-admin
pm2 save
pm2 startup
```

### 3. Настройка nginx (reverse proxy)

Добавьте в конфиг nginx:

```nginx
location /admin {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**Доступ:** https://uliyanovsk.ru/admin

---

## 📝 API

### Авторизация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/login` | Вход по паролю |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/check` | Проверка сессии |
| POST | `/api/auth/change-password` | Смена пароля |

### Работа с данными

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/data/stream` | Получить настройки стрима |
| POST | `/api/data/stream` | Обновить стрим |
| GET | `/api/data/notify` | Получить уведомления |
| POST | `/api/data/notify` | Обновить уведомления |
| GET | `/api/data/services` | Получить проповеди |
| POST | `/api/data/services` | Добавить проповедь |
| DELETE | `/api/data/services/:id` | Удалить проповедь |
| ... | ... | ... |

---

## 🔧 Смена пароля

1. Войдите в админку
2. Откройте страницу смены пароля
3. Введите текущий и новый пароль
4. Сохраните

Или через файл `data/config.json` (вручную):

```json
{
  "passwordHash": "$2b$10$новый_хэш"
}
```

---

## ⚠️ Важно

- **Храните `.env` в секрете** — не коммитьте в Git
- **Используйте HTTPS** на продакшене
- **Регулярно меняйте пароль** админки
- **Ограничьте доступ** по IP (опционально через nginx)

---

## 📞 Поддержка

Вопросы и предложения: site@uliyanovsk.ru

---

**© 2026 Общение Христиан. Конфиденциально.**
