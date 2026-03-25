import getDataJson from '/js/utils/getDataJson.js'
import shuffleArray from '/js/utils/shuffleArray.js'
import { onOffButtonToUp, scrollToTop } from '/js/modules/buttonToUp.js'

document.addEventListener('headerReady', () => {
    const vidInMain = document.querySelector('.main-video video')
    const titleInMain = document.querySelector('.title-video-player')
    const videoList = document.querySelector('.video-list')
    const repeatBtn = document.querySelector('.repeat')
    const randomBtn = document.querySelector('.random')
    const buttonToTop = document.querySelector('.button-to-top')

    // Проверка на существование критических элементов
    if (!vidInMain) {
        console.error('music-video.js: Видео элемент не найден')
        return
    }
    if (!titleInMain) {
        console.error('music-video.js: Элемент заголовка не найден')
        return
    }
    if (!videoList) {
        console.error('music-video.js: Список видео не найден')
        return
    }

    let isRepeat = false

    // создаёт элемент плей-листа
    const createVideoElement = (keyMusic, isActive) => `
        <div class="vid ${isActive ? 'active' : ''}">
            <video
                poster="files/video/music/poster-music/${keyMusic}.webp"
            ></video>
            <h3 class="title-video">${keyMusic.slice(0, 10)} – Музыка на служении</h3>
        </div>`

    // создаёт элемент основного плеера
    const updateMainVideo = keyMusic => {
        vidInMain.poster = `files/video/music/poster-music/${keyMusic}.webp`
        vidInMain.src = `files/video/music/${keyMusic}.mp4`
        titleInMain.textContent = `${keyMusic.slice(0, 10)} – Музыка на служении`
    }

    // Функция для воспроизведения выбранного видео
    const playVideo = (vids, video) => {
        vids.forEach(vid => vid.classList.remove('active'))
        video.classList.add('active')
        const srcVideo = video
            .querySelector('video')
            .poster.replace(/poster-music\/|webp/g, function (str) {
                if (str === 'poster-music/') return ''
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

    // функция построения списка псалмов
    const loadMainAndListVideo = musicAlbumKeys => {
        if (musicAlbumKeys.length === 0) {
            console.warn('music-video.js: Нет доступных видео')
            videoList.innerHTML = '<div class="no-videos">Видео недоступны</div>'
            return
        }
        
        updateMainVideo(musicAlbumKeys[0])
        videoList.innerHTML = musicAlbumKeys
            .map((key, i) => createVideoElement(key, i === 0))
            .join('')
    }

    // функция перемешивания видео псалмов
    const shufflePlaylistVideo = musicAlbumKeys => {
        const shuffledKeys = shuffleArray(musicAlbumKeys)
        loadMainAndListVideo(shuffledKeys)
        const vids = document.querySelectorAll('.vid')
        playVideo(vids, vids[0])
        addVideoEventListeners(vids)
        handleVideoEnd(vids)
    }

    // Назначаем событие onclick каждому видео из списка
    const addVideoEventListeners = vids => {
        vids.forEach(video => (video.onclick = () => playVideo(vids, video)))
    }

    const start = jsonVideoMusic => {
        // отсортированный по возрастанию массив ключей music
        const musicAlbumKeys = Object.keys(jsonVideoMusic).sort().reverse()

        loadMainAndListVideo(musicAlbumKeys)
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
            shufflePlaylistVideo(musicAlbumKeys)
        })

        // плавный скрол вверх
        buttonToTop.addEventListener('click', () => {
            scrollToTop()
        })
    }

    // старт
    getDataJson(`/data/music.json`)
        .then(jsonVideoMusic => {
            start(jsonVideoMusic)
            onOffButtonToUp()
        })
        .catch(error => {
            console.error('music-video.js: ошибка загрузки данных:', error)
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
