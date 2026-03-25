import getDataJson from '/js/utils/getDataJson.js'
import getDate from '/js/utils/getDate.js'
import { getDateFromId } from '/js/utils/getDateFromId.js'

document.addEventListener('DOMContentLoaded', () => {
    // получает элементы страницы
    const bodySearch = document.querySelector('.body')
    const searchOpen = document.querySelector('.header__menu-link-search')
    const searchBlock = document.querySelector('.search')
    const searchClose = document.querySelector('.search__close')
    const inputContainer = document.querySelector('.search__input-container')
    const inputSearch = document.querySelector('.search__input')
    const inputClear = document.querySelector('.search__input-clear')
    const searchInnerResult = document.querySelector('.search__inner-result')
    const searchResult = document.querySelector('.search__result')
    const burger = document.querySelector('.header__menu-icon')
    const menu = document.querySelector('.header__menu')
    const brgrumbSearch = document.querySelector('.breadcrumbs')

    // Функция экранирования HTML для защиты от XSS
    const escapeHtml = text => {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    // функция открытия поиска
    const openSearch = () => {
        closeMenu()
        searchBlock.style.display = 'flex'
        setTimeout(() => {
            searchBlock.classList.add('_active')
            brgrumbSearch.classList.add('_close')
            bodySearch.style.overflow = 'hidden'
            inputSearch.value = ''
        }, 100)
    }

    // функция закрытия поиска
    const closeSearch = () => {
        searchBlock.classList.remove('_active')
        bodySearch.style.removeProperty('overflow')
        brgrumbSearch.classList.remove('_close')
        searchInnerResult.classList.remove('_active')
        setTimeout(() => {
            searchBlock.style.removeProperty('display')
        }, 300)
    }

    // функция проверки ввода в поисковой строке
    const startInput = () => {
        inputContainer.classList.add('_active')
        searchResult.innerHTML = ''
        if (inputSearch.value.length > 2) {
            searchInnerResult.classList.add('_active')
            searchInJSON(inputSearch.value)
        } else {
            searchInnerResult.classList.remove('_active')
            if (inputSearch.value.length < 1) {
                inputContainer.classList.remove('_active')
            }
        }
    }

    // функция очистки поисковой строки
    const clearInput = () => {
        inputContainer.classList.remove('_active')
        searchInnerResult.classList.remove('_active')
        inputSearch.value = ''
        inputSearch.focus()
    }

    // функция закрытия меню
    const closeMenu = () => {
        burger.classList.remove('_active')
        burger.style.opacity = 1
        menu.classList.remove('_active')
        burger.style.pointerEvents = 'auto'
    }

    // функция построения списка с результатами (использует textContent для безопасности)
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

    // функция поиска по базе JSON
    const searchInJSON = keyWord => {
        // Запускаем оба запроса параллельно
        Promise.all([
            getDataJson(`/data/services.json`),
            getDataJson(`/data/message.json`),
        ])
            .then(([servicesData, messageData]) => {
                // Оба запроса успешно выполнены, обрабатываем данные
                const servicesKeys = Object.keys(servicesData)
                const messageKeys = Object.keys(messageData)

                // Перебираем и обрабатываем данные из services.json
                for (let key of servicesKeys) {
                    if (
                        servicesData[key].name
                            .toLowerCase()
                            .includes(keyWord.toLowerCase()) ||
                        servicesData[key].minister
                            .toLowerCase()
                            .includes(keyWord.toLowerCase())
                    ) {
                        buildingListSearchResults(
                            servicesData,
                            key,
                            'search__link-services',
                            'services',
                            'minister'
                        )
                    }
                }

                // Перебираем и обрабатываем данные из message.json
                for (let key of messageKeys) {
                    if (
                        messageData[key].name.toLowerCase().includes(keyWord.toLowerCase())
                    ) {
                        buildingListSearchResults(
                            messageData,
                            key,
                            'search__link-message',
                            'message',
                            'Уилльям Маррион Бранхам'
                        )
                    }
                }

                // Проверяем, есть ли результаты поиска
                if (searchResult.innerHTML === '') {
                    // Безопасная вставка текста
                    searchResult.textContent = 'Поиск не дал результатов, попробуйте ввести другой запрос'
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error)
                searchResult.textContent = 'Ошибка загрузки данных. Попробуйте обновить страницу.'
            })
    }

    // обработка событий
    searchOpen.addEventListener('click', openSearch)
    searchClose.addEventListener('click', closeSearch)
    inputSearch.addEventListener('input', startInput)
    inputClear.addEventListener('click', clearInput)
})
