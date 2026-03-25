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
            const errorSelectors = [
                '.video-list',
                '.message__inner',
                '.psalms__links',
                '.music__inner',
                '.sermons__inner',
                '.last-events__inner'
            ]
            
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
