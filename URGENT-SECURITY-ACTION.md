# 🚨 СРОЧНО: Действия по безопасности

## Проблема обнаружена

В файле `uliyanovsk.ru/sendmail.php` найден **пароль в открытом виде**:

```php
$mail->Password = 'hdycbahktagdqywd';  // ← ПАРОЛЬ ОТ YANDEX
```

Этот файл **уже отправлен на GitHub** и находится в открытом доступе!

---

## ✅ Что уже сделано

1. **Создан безопасный `sendmail-safe.php`** — читает пароль из `.env` файла
2. **Создан `.env.example`** — шаблон для настройки SMTP
3. **Добавлен `.gitignore`** — файлы `.env` больше не будут коммититься
4. **Создана `SECURITY-INSTRUCTION.md`** — полная инструкция по безопасности
5. **Админка добавлена в репозиторий безопасно**:
   - ✅ `server.js`, `routes/*.js`, `public/**` — отправлены
   - ❌ `.env`, `data/config.json`, `node_modules/` — игнорируются

---

## 🔴 ЧТО НУЖНО СДЕЛАТЬ ПРЯМО СЕЙЧАС

### Шаг 1: Смените пароль от Yandex (5 минут)

**Вариант A (РЕКОМЕНДУЕТСЯ): Пароль приложения**

1. Откройте https://passport.yandex.ru/profile/access
2. Включите двухфакторную аутентификацию (если не включена)
3. Нажмите "Пароли приложений" → "Создать новый пароль"
4. Назовите: `SMTP для сайта uliyanovsk.ru`
5. Скопируйте пароль (вида `abcd-efgh-ijkl-mnop`)

**Вариант B: Смена основного пароля**

1. Откройте https://passport.yandex.ru/profile
2. Нажмите "Изменить пароль"
3. Придумайте новый надёжный пароль (минимум 12 символов)

---

### Шаг 2: Создайте файл .env на сервере

**Файл:** `/var/www/uliyanovsk.ru/.env` (или где у вас сайт)

```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=anir.u@yandex.ru
SMTP_PASSWORD=ваш_новый_пароль_приложения
MAIL_FROM=anir.u@yandex.ru
MAIL_FROM_NAME="Сайт Общение Христиан"
MAIL_TO=anir.u@yandex.ru
SECRET_KEY=BIGSecret
```

**Права доступа:**
```bash
chmod 600 /var/www/uliyanovsk.ru/.env
chown www-data:www-data /var/www/uliyanovsk.ru/.env
```

---

### Шаг 3: Обновите sendmail.php на сервере

**Вариант A: Использовать новый файл (рекомендуется)**

```bash
cd /var/www/uliyanovsk.ru
mv sendmail.php sendmail-old.php  # резервная копия
mv sendmail-safe.php sendmail.php
```

**Вариант B: Вручную изменить старый**

Откройте `sendmail.php` и замените:

```php
// БЫЛО (НЕБЕЗОПАСНО):
$mail->Password = 'hdycbahktagdqywd';

// СТАЛО (БЕЗОПАСНО):
$mail->Password = getenv('SMTP_PASSWORD');
```

И добавьте загрузку `.env` в начало файла.

---

### Шаг 4: Проверьте работу формы

1. Откройте главную страницу сайта
2. Заполните форму обратной связи
3. Отправьте сообщение
4. Проверьте, что письмо пришло

---

### Шаг 5: Настройте админку

**Локально:**

```bash
cd galaxy.uliyanovsk.ru
copy .env.example .env
# Отредактируйте .env (SESSION_SECRET, DATA_DIR)
npm install
npm start
```

**На сервере:**

```bash
cd /var/www/uliyanovsk.ru/galaxy.uliyanovsk.ru
cp .env.example .env
nano .env  # настройте SESSION_SECRET
npm install
pm2 start server.js --name galaxy-admin
```

---

## 📋 Чеклист

- [ ] **Сменён пароль Yandex** (основной или приложение)
- [ ] **Создан .env на сервере** с новым паролем
- [ ] **sendmail.php обновлён** на сервере
- [ ] **Форма работает** (проверено отправкой)
- [ ] **Админка настроена** и запущена

---

## 🔐 Что НЕЛЬЗЯ делать

❌ **НЕ коммитьте `.env` в Git** — уже добавлен в `.gitignore`  
❌ **НЕ храните пароли в коде** — используйте переменные окружения  
❌ **НЕ используйте один пароль везде** — для SMTP используйте пароль приложения  
❌ **НЕ игнорируйте обновления безопасности** — регулярно меняйте пароли

---

## 📞 Если нужна помощь

- Инструкция: `SECURITY-INSTRUCTION.md`
- Документация админки: `galaxy.uliyanovsk.ru/README.md`
- Основная документация: `README.md`

---

**© 2026 Общение Христиан. Конфиденциально.**
