import getDataJson from './utils/getDataJson.js'
import { websiteAccess } from './modules/websiteAccess.js'
import { bodySizeLoad, bodyResize } from './modules/sizeWindow.js'
import onloadImgs from './modules/onloadImgs.js'
import { onOfSubmenu, closeMenuClickAway, onOfMenu } from './modules/menuAction.js'
import onOffStreamLed from './modules/onOffStreamLed.js'
import yearInFooter from './modules/yearInFooter.js'

let isInitialized = false

const init = () => {
    if (isInitialized) return
    isInitialized = true

    // Загрузка данных псалмов и рендеринг ссылок по годам
    getDataJson('/data/psalms.json')
        .then(data => {
            const psalmsLinksContainer = document.querySelector('.psalms__links')
            if (!psalmsLinksContainer) {
                console.error('worship.js: Элемент .psalms__links не найден')
                return
            }

            const years = Object.keys(data.psalms).sort((a, b) => Number(b) - Number(a))
            
            if (years.length === 0) {
                psalmsLinksContainer.innerHTML = '<div class="no-data">Данные недоступны</div>'
                return
            }

            psalmsLinksContainer.innerHTML = years
                .map(year => `<a href="psalms-${year}.html" class="psalms__link">Сольные песни ${year}</a>`)
                .join('')
        })
        .catch(error => {
            console.error('worship.js: ошибка загрузки psalms.json:', error)
            const psalmsLinksContainer = document.querySelector('.psalms__links')
            if (psalmsLinksContainer) {
                psalmsLinksContainer.innerHTML = `
                    <div class="error-message" style="
                        padding: 20px;
                        text-align: center;
                        color: #721c24;
                        background-color: #f8d7da;
                        border: 1px solid #f5c6cb;
                        border-radius: 4px;
                    ">
                        Не удалось загрузить данные. Попробуйте обновить страницу.
                    </div>
                `
            }
        })

    // Рендеринг breadcrumbs
    const breadcrumbsContainer = document.querySelector('.breadcrumbs')
    if (breadcrumbsContainer) {
        breadcrumbsContainer.innerHTML = `
            <div class="breadcrumbs__inner">
                <a class="breadcrumbs__item breadcrumbs__link" href="/">
                    <span>Главная</span>
                    <img class="breadcrumbs__arrow json" src="img/icon/arrow-right.svg" alt="" width="16" height="16" aria-hidden="true">
                </a>
                <div class="breadcrumbs__item">Поклонение</div>
            </div>
            <div class="breadcrumbs__fon-extra"></div>
        `
    }

    // Инициализация модулей
    websiteAccess()
    bodySizeLoad()
    bodyResize()
    onloadImgs()
    onOfMenu()
    onOfSubmenu()
    closeMenuClickAway()
    onOffStreamLed()
    yearInFooter()
}

// Попытка инициализации после headerReady
if (window.headerReady) {
    init()
} else {
    document.addEventListener('headerReady', init)
}

// Таймаут ожидания headerReady (5 секунд)
setTimeout(() => {
    if (!isInitialized) {
        console.warn('worship.js: таймаут ожидания headerReady — принудительная инициализация')
        init()
    }
}, 5000)

// Таймаут для loader (10 секунд)
setTimeout(() => {
    const maskElement = document.querySelector('.mask')
    if (maskElement && !maskElement.classList.contains('_hide')) {
        console.warn('worship.js: Loader timeout — принудительное закрытие')
        maskElement.classList.add('_hide')
        setTimeout(() => {
            maskElement.remove()
        }, 600)
    }
}, 10000)
