import getDataJson from '/js/utils/getDataJson.js'
import shuffleArray from '/js/utils/shuffleArray.js'

document.addEventListener('headerReady', () => {
    // Проверка существования элемента title с id
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

    let isRepeat = false

    // создаёт элемент плей-листа
    const createVideoElement = (psalm, isActive) => `
        <div class="vid ${isActive ? 'active' : ''}">
            <video
                poster="files/video/songs/${year}/poster-psalms/${psalm.fileName}.webp"
            ></video>
            <h3 class="title-video">${psalm.name}</h3>
        </div>`

    // создаёт элемент основного плеера
    const updateMainVideo = psalm => {
        vidInMain.poster = `files/video/songs/${year}/poster-psalms/${psalm.fileName}.webp`
        vidInMain.src = `files/video/songs/${year}/${psalm.fileName}.mp4`
        titleInMain.textContent = psalm.name
    }

    // Функция для воспроизведения выбранного видео
    const playVideo = (vids, video) => {
        vids.forEach(vid => vid.classList.remove('active'))
        video.classList.add('active')
        const srcVideo = video
            .querySelector('video')
            .poster.replace(/poster-psalms\/|webp/g, function (str) {
                if (str === 'poster-psalms/') return ''
                if (str === 'webp') return 'mp4'
            })
        vidInMain.src = srcVideo
        vidInMain.poster = video.querySelector('video').poster
        titleInMain.textContent = video.querySelector('.title-video').textContent
        vidInMain.setAttribute('autoplay', true)
    }

    // Обработчик события окончания текущего видео
    const handleVideoEnd = vids => {
        vidInMain.addEventListener('ended', () => {
            const currentVideo = document.querySelector('.video-list .vid.active')
            let nextVideo =
                currentVideo.nextElementSibling || (isRepeat ? vids[0] : null)
            if (nextVideo) playVideo(vids, nextVideo)
        })
    }

    // функция построения списка псалмов с фильтрацией по hasVideo
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

    // функция перемешивания видео псалмов
    const shufflePlaylistVideo = (psalmsAlbum, psalmsAlbumKeys) => {
        const shuffledKeys = shuffleArray(psalmsAlbumKeys)
        loadMainAndListVideo(psalmsAlbum, shuffledKeys)
        const vids = document.querySelectorAll('.vid')
        playVideo(vids, vids[0])
        addVideoEventListeners(vids)
        handleVideoEnd(vids)
    }

    // Назначаем событие onclick каждому видео из списка
    const addVideoEventListeners = vids => {
        vids.forEach(video => (video.onclick = () => playVideo(vids, video)))
    }

    const start = jsonVideoPsalms => {
        // получает псалмы за указанный год
        const psalmsAlbum = jsonVideoPsalms.psalms[year]
        
        if (!psalmsAlbum) {
            console.error('psalms-video.js: Данные для года', year, 'не найдены')
            videoList.innerHTML = '<div class="no-videos">Данные недоступны</div>'
            return
        }
        
        const psalmsAlbumKeys = Object.keys(psalmsAlbum).reverse()

        loadMainAndListVideo(psalmsAlbum, psalmsAlbumKeys)
        const vids = document.querySelectorAll('.vid')

        addVideoEventListeners(vids)
        handleVideoEnd(vids)

        // Обработчик для кнопки "repeat"
        repeatBtn.addEventListener('click', () => {
            isRepeat = !isRepeat
            repeatBtn.classList.toggle('active', isRepeat)
        })

        // Обработчик для кнопки "random"
        randomBtn.addEventListener('click', () => {
            randomBtn.classList.add('active')
            shufflePlaylistVideo(psalmsAlbum, psalmsAlbumKeys)
        })
    }

    // старт
    getDataJson(`/data/psalms.json`)
        .then(data => start(data))
        .catch(error => {
            console.error('psalms-video.js: ошибка загрузки данных:', error)
            videoList.innerHTML = `
                <div class="error-message" style="
                    padding: 20px;
                    text-align: center;
                    color: #721c24;
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 4px;
                ">
                    Не удалось загрузить видео. Попробуйте обновить страницу.
                </div>
            `
        })
})
