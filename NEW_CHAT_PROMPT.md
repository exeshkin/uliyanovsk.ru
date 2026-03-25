# Задача: Исправление ошибок на сайте uliyanovsk.ru

## Контекст
Официальный сайт христианской церкви «Общение Христиан» (uliyanovsk.ru).
Статический сайт с SSI (header/footer), динамическим контентом через JSON.

## Структура проекта
```
site_2026_v3/
├── server.py               # Локальный SSI-сервер (Python) — УЖЕ ЕСТЬ
├── start-server.bat        # Запуск сервера — УЖЕ ЕСТЬ
├── stop-server.bat         # Остановка сервера — УЖЕ ЕСТЬ
└── uliyanovsk.ru/          # Сайт
    ├── index.html
    ├── contacts.html
    ├── services.html
    ├── worship.html
    ├── psalms-2023.html
    ├── psalms-2024.html
    ├── psalms-2025.html
    ├── psalms-2026.html
    ├── message.html
    ├── message-years-*.html
    ├── video.html
    ├── video-list.html
    ├── photo.html
    ├── photo-list.html
    ├── streamvideo.html
    ├── minister-*.html
    ├── css/
    ├── js/
    ├── data/               # JSON файлы (message.json, services.json, etc.)
    └── includes/           # SSI включения (header.html, footer.html)
```

---

## Задачи (выполнять ПО СЛЕДУЮЩЕМУ ПЛАНУ)

### ⚠️ ПЛАН ВЫПОЛНЕНИЯ

| № | Задача | Порядок |
|---|--------|---------|
| 1 | Исправить FOUC в Firefox на index.html | **ПЕРВОЙ** |
| 2 | Исправить race condition в видеоплеерах | Второй |
| 3 | Исправить обработку ошибок в getDataJson.js | Третьей |
| 4 | Исправить кэширование в getDataJson.js | Четвёртой |
| 5 | Удалить мёртвый CSS код | Пятой |
| 6 | Исправить XSS в search.js | Шестой |
| 7 | **Обновить ВСЕ версии на v=20260325** | **ПОСЛЕДНЕЙ** |

---

## Задача 1: Исправить FOUC в Firefox на index.html

**Выполнять ПЕРВОЙ!**

**Проблема:** На `index.html` стили мигают при загрузке (FOUC — Flash Of Unstyled Content)

**Причина:** CSS подключён ПОСЛЕ скрипта Yandex.Metrika

**Решение:** Переместить все `<link rel="stylesheet">` **ВЫШЕ** скрипта метрики

**Файл:** `uliyanovsk.ru/index.html`

**Было:**
```html
<meta name="yandex-verification" content="d72af7aebe06e6ea" />
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(86600993, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    });
</script>
<noscript>
    <div><img src="https://mc.yandex.ru/watch/86600993" style="position:absolute; left:-9999px;" alt="" /></div>
</noscript>
<!-- /Yandex.Metrika counter -->
<link rel="icon" href="img/icon/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="css/style.css?v=20260303">
<link rel="stylesheet" href="css/search.css?v=20260303">
<link rel="stylesheet" href="css/password.css?v=20260303">
<link rel="stylesheet" href="css/notify.css?v=20260303">
```

**Стало:**
```html
<meta name="yandex-verification" content="d72af7aebe06e6ea" />
<link rel="icon" href="img/icon/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="css/style.css?v=20260303">
<link rel="stylesheet" href="css/search.css?v=20260303">
<link rel="stylesheet" href="css/password.css?v=20260303">
<link rel="stylesheet" href="css/notify.css?v=20260303">
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(86600993, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    });
</script>
<noscript>
    <div><img src="https://mc.yandex.ru/watch/86600993" style="position:absolute; left:-9999px;" alt="" /></div>
</noscript>
<!-- /Yandex.Metrika counter -->
```

---

## Задача 2: Исправить race condition в видеоплеерах

**Проблема:** На `worship.html`, `psalms-202x.html` видео и постеры не загружаются (иногда)

**Причина:** Нет проверок на существование элементов перед использованием

### 2A. Файл `js/psalms-video.js`

Добавить проверки:
- `titleElement` и `titleElement.id`
- `vidInMain` (видео элемент)
- `titleInMain` (заголовок)
- `videoList` (список видео)
- Фильтрация по `hasVideo: true`

**Пример:**
```javascript
document.addEventListener('headerReady', () => {
    // Проверка существования элементов
    const titleElement = document.querySelector('title')
    if (!titleElement || !titleElement.id) {
        console.error('psalms-video.js: Элемент title с id не найден')
        return
    }

    const year = titleElement.id
    const vidInMain = document.querySelector('.main-video video')
    const titleInMain = document.querySelector('.title-video-player')
    const videoList = document.querySelector('.video-list')
    const repeatBtn = document.querySelector('.repeat')
    const randomBtn = document.querySelector('.random')

    // Проверка на существование критических элементов
    if (!vidInMain) {
        console.error('psalms-video.js: Видео элемент не найден')
        return
    }
    if (!titleInMain) {
        console.error('psalms-video.js: Элемент заголовка не найден')
        return
    }
    if (!videoList) {
        console.error('psalms-video.js: Список видео не найден')
        return
    }

    // ... остальной код
})
```

**Фильтрация по hasVideo:**
```javascript
const loadMainAndListVideo = (psalmsAlbum, psalmsAlbumKeys) => {
    // Фильтруем только те псалмы, у которых есть видео
    const videoKeys = psalmsAlbumKeys.filter(key => {
        const psalm = psalmsAlbum[key]
        return psalm.hasVideo === true
    })

    if (videoKeys.length === 0) {
        console.warn('psalms-video.js: Нет псалмов с видео для года', year)
        videoList.innerHTML = '<div class="no-videos">Видео недоступны</div>'
        return
    }

    const firstPsalm = psalmsAlbum[videoKeys[0]]
    updateMainVideo(firstPsalm)
    videoList.innerHTML = videoKeys
        .map((key, i) => createVideoElement(psalmsAlbum[key], i === 0))
        .join('')
}
```

### 2B. Файл `js/music-video.js`

Добавить проверки:
- `vidInMain`
- `titleInMain`
- `videoList`

### 2C. Файл `js/worship.js`

- Расшифровать из минификации
- Добавить обработку ошибок

---

## Задача 3: Исправить обработку ошибок в getDataJson.js

**Проблема:** При ошибке загрузки JSON пользователь не видит сообщения

**Файл:** `js/utils/getDataJson.js`

**Решение:**
1. Добавить параметр `useCache = false` (по умолчанию)
2. Показывать сообщение об ошибке в UI

**Пример:**
```javascript
/**
 * Функция загрузки JSON данных
 * @param {string} url - URL для запроса
 * @param {boolean} useCache - Использовать ли кэш (по умолчанию false)
 * @returns {Promise<any>} - Данные JSON
 */
const getDataJson = (url, useCache = false) => {
    // Добавляем cache-buster только если useCache = false
    const fetchUrl = useCache 
        ? url 
        : (() => {
            const separator = url.includes('?') ? '&' : '?'
            return `${url}${separator}t=${new Date().getTime()}`
        })()

    return fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return response.json()
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(`getDataJson: ошибка загрузки ${url}:`, error)
            
            // Показываем сообщение пользователю, если есть элемент для ошибок
            const errorSelectors = ['.video-list', '.message__inner', '.psalms__links']
            for (const selector of errorSelectors) {
                const errorElement = document.querySelector(selector)
                if (errorElement && !errorElement.querySelector('.error-message')) {
                    errorElement.innerHTML = `
                        <div class="error-message" style="
                            padding: 20px;
                            text-align: center;
                            color: #721c24;
                            background-color: #f8d7da;
                            border: 1px solid #f5c6cb;
                            border-radius: 4px;
                            margin: 10px 0;
                        ">
                            Не удалось загрузить данные. Попробуйте обновить страницу.
                        </div>
                    `
                    break
                }
            }
            
            throw error
        })
}

export default getDataJson
```

---

## Задача 4: Исправить кэширование в getDataJson.js

**Проблема:** Cache-buster добавлялся всегда, кэш не работал

**Решение:** Добавить параметр `useCache`:
- `useCache = false` (по умолчанию) — добавляет timestamp
- `useCache = true` — не добавляет timestamp

**См. Задачу 3** — решение там же.

---

## Задача 5: Удалить мёртвый CSS код

**Проблема:** Неиспользуемые классы в `style.css`:
- `.error-fzf`
- `.error-fzf__btn`
- `.error-fzf__info`
- `.error-fzf__btn:last-child`
- `.error-fzf__btn:hover`
- И все упоминания в @media запросах

**Файл:** `uliyanovsk.ru/css/style.css`

**Решение:** Удалить все упоминания через безопасный скрипт.

**Пример Python-скрипта:**
```python
import re

with open('uliyanovsk.ru/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Удаляем все упоминания error-fzf
patterns = [
    r',\.error-fzf\{flex-direction:column;justify-content:space-around;flex-grow:1;padding:15px 0\}',
    r'\.error-fzf__btn,\.error-fzf__info\{display:flex;justify-content:center;align-items:center\}',
    r'\.error-fzf__info\{flex-direction:column;font-size:14px;line-height:14px\}',
    r'\.error-fzf img\{display:block;width:80%\}',
    r'\.error-fzf p\{padding:0 0 20px\}',
    r'\.error-fzf__btn\{display:block;width:200px;border:1px solid rgba\(52,50,50,\.5\);padding:7px 43px;margin-bottom:7px;font-size:11px;line-height:11px;color:#263952;transition:all 300ms\}',
    r'\.error-fzf__btn:last-child\{margin-bottom:0\}',
    r'\.error-fzf__btn:hover\{transform:scale\(1\.05\);background:rgba\(162,163,169,\.5\)\}',
    r'\.error-fzf\{padding:15px 0\}',
    r'\.error-fzf\{padding:20px 0\}',
    r'\.error-fzf\{padding:25px 0\}',
    r'\.error-fzf\{padding:30px 0\}',
    r'\.error-fzf\{padding:35px 0\}',
    r'\.error-fzf__info\{font-size:15px;line-height:15px\}',
    r'\.error-fzf__info\{font-size:16px;line-height:16px\}',
    r'\.error-fzf__info\{font-size:17px;line-height:17px\}',
    r'\.error-fzf__info\{font-size:18px;line-height:18px\}',
    r'\.error-fzf__info\{font-size:19px;line-height:19px\}',
    r'\.error-fzf__info\{font-size:20px;line-height:20px\}',
    r'\.error-fzf__info\{font-size:22px;line-height:22px\}',
    r'\.error-fzf__btn\{width:230px;font-size:14px;line-height:14px\}',
    r'\.error-fzf__btn\{width:250px\}',
    r'\.error-fzf__btn\{width:260px\}',
    r'\.error-fzf__btn\{width:270px\}',
    r'\.error-fzf__btn\{width:290px;padding:10px 50px\}',
]

for pattern in patterns:
    css = re.sub(pattern, '', css)

# Также удаляем .button-to-top,.error-fzf и заменяем на .button-to-top
css = css.replace('.button-to-top,.error-fzf{display:flex;align-items:center}', '.button-to-top{display:flex;align-items:center}')

with open('uliyanovsk.ru/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Готово!')
```

---

## Задача 6: Исправить XSS в search.js

**Проблема:** Пользовательский ввод вставляется через `innerHTML`

**Файл:** `js/search.js`

**Решение:**
1. Добавить функцию `escapeHtml`
2. Использовать `textContent` вместо `innerHTML`

**Пример:**
```javascript
import getDataJson from '/js/utils/getDataJson.js'
import getDate from '/js/utils/getDate.js'
import { getDateFromId } from '/js/utils/getDateFromId.js'

document.addEventListener('DOMContentLoaded', () => {
    // ... получение элементов ...

    // Функция экранирования HTML для защиты от XSS
    const escapeHtml = text => {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    // Функция построения списка с результатами (использует textContent для безопасности)
    const buildingListSearchResults = (
        obj,
        key,
        selector,
        page,
        currentMinister
    ) => {
        const linkSearch = document.createElement('a')
        linkSearch.classList = `search__link ${selector}`
        linkSearch.setAttribute('href', `${page}.html?id=${key}`)
        
        const date =
            currentMinister === 'Уилльям Маррион Бранхам'
                ? getDateFromId(key)
                : getDate(obj, key)
        const minister =
            currentMinister === 'Уилльям Маррион Бранхам'
                ? 'Уилльям Маррион Бранхам'
                : `${obj[key][currentMinister]}`
        
        // Безопасная вставка текста через textContent вместо innerHTML
        linkSearch.textContent = `${date} «${obj[key].name}» - ${minister}`
        
        searchResult.appendChild(linkSearch)
    }

    // ... остальной код ...

    // Проверяем, есть ли результаты поиска
    if (searchResult.innerHTML === '') {
        // Безопасная вставка текста
        searchResult.textContent = 'Поиск не дал результатов, попробуйте ввести другой запрос'
    }
})
```

---

## Задача 7: Обновить ВСЕ версии на v=20260325

**Выполнять ПОСЛЕДНЕЙ!**

**Проблема:** В разных файлах разные версии:
- `v=20260303` (большинство файлов)
- `v=20260324` (psalms-202x.html, worship.html, index.html после исправления FOUC)

**Решение:** Обновить ВСЕ версии на `v=20260325`

**Файлы для обновления:**
- Все `*.html` в корне `uliyanovsk.ru/`

**⚠️ КРИТИЧЕСКИ ВАЖНО:** При обновлении:
1. СНАЧАЛА читать содержимое файла
2. ПОТОМ делать замену
3. ПОТОМ записывать
4. **ПРОВЕРЯТЬ размер файла после записи!**

**Пример безопасного кода:**
```python
import glob
import re
import os

print("Начало обновления версий...")

for filepath in glob.glob('uliyanovsk.ru/*.html'):
    # СНАЧАЛА читаем
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Проверяем, что файл не пустой
    if not content:
        print(f"❌ ERROR: {filepath} пустой! Пропускаем.")
        continue
    
    original_size = len(content)
    
    # Делаем замену
    content = re.sub(r'\?v=202603\d+', '?v=20260325', content)
    
    # ПОТОМ записываем
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Проверяем размер после записи
    new_size = os.path.getsize(filepath)
    if new_size == 0:
        print(f"❌ CRITICAL ERROR: {filepath} стал пустым после записи!")
        continue
    
    print(f"✅ Обновлён: {filepath} ({original_size} → {new_size} bytes)")

print("\nГотово! Все версии обновлены на v=20260325")
```

**Проверка после обновления:**
```bash
# Проверить, что все версии обновлены
findstr /C:"?v=20260325" uliyanovsk.ru\*.html
```

---

## Проверка после выполнения ВСЕХ задач

1. **Запустить сервер:**
   ```bash
   python server.py
   ```

2. **Проверить страницы:**
   - `http://localhost:8080/` — главная (нет FOUC в Firefox)
   - `http://localhost:8080/psalms-2025.html` — псалмы (видео загружается)
   - `http://localhost:8080/worship.html` — поклонение (видео загружается)

3. **Проверить версии:**
   ```bash
   findstr /C:"?v=20260325" uliyanovsk.ru\*.html
   ```
   Все CSS/JS должны иметь `?v=20260325`

4. **Проверить FOUC:**
   - Открыть `index.html` в Firefox
   - Стили не должны мигать

---

## Известные проблемы (НЕ ИСПРАВЛЯТЬ СЕЙЧАС)

⚠️ **Разная ширина видео на psalms-202x.html @1400px+**
- Причина: постеры к видео имеют разные размеры
- Решение: требуется унификация изображений (не CSS!)
- Оставить на будущее

---

## MCP инструменты

Для UI/UX аудита использовать `@ui-expert`:
- `analyze_ui` — анализ текущего UI/UX
- `improve_component` — улучшение компонентов

Для работы с файлами — `Desktop Commander`:
- `read_file`, `write_file`, `edit_block`
- `glob`, `grep_search`

---

## НАЧАТЬ С ЗАДАЧИ 1 (Исправить FOUC)
