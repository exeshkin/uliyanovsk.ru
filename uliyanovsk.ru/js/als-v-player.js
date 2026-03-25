// @ts-check

import { btnOnAudio } from './utils/btnsVideoAudio.js'

// Получает элементы управления видео
const alsVPlayer = /** @type {HTMLDivElement} */ (
	document.querySelector('.als-v-player')
)
const video = /** @type {HTMLVideoElement} */ (
	document.querySelector('.avp-video')
)
const controlPanel = /** @type {HTMLDivElement} */ (
	document.querySelector('.avp-control-panel')
)
const timeBar = /** @type {HTMLDivElement} */ (
	document.querySelector('.avp-time-bar')
)
const timePreview = /** @type {HTMLDivElement} */ (
	document.querySelector('.avp-time-preview')
)
const timeLine = /** @type {HTMLDivElement} */ (
	document.querySelector('.avp-time-line')
)
const btnPlayPause = /** @type {HTMLButtonElement} */ (
	document.getElementById('avp-btn-play-pause')
)
const btnReplay = /** @type {HTMLButtonElement} */ (
	document.getElementById('avp-btn-replay')
)
const btnForward = /** @type {HTMLButtonElement} */ (
	document.getElementById('avp-btn-forward')
)
const currentTime = /** @type {HTMLDivElement} */ (
	document.getElementById('avp-current-time')
)
const durationTime = /** @type {HTMLDivElement} */ (
	document.getElementById('avp-duration-time')
)
const btnVolume = /** @type {HTMLButtonElement} */ (
	document.getElementById('avp-btn-volume')
)
const inputVolumeControl = /** @type {HTMLInputElement} */ (
	document.getElementById('avp-input-volume-control')
)
const btnFullscreen = /** @type {HTMLButtonElement} */ (
	document.getElementById('avp-btn-fullscreen')
)

// Получаем блок с карточками видео / аудио
const cards = /** @type {HTMLDivElement} */ document.querySelector(
	'.preaching-article__cards'
)

// Идентификатор таймера для скрытия элементов управления
let mouseTimer
/** @type {number} */
let currentVolume = 1

/**
 * Функция для проверки, является ли устройство сенсорным
 * @returns {boolean}
 */
const isTouchDevice = () => {
	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-ignore
		navigator.msMaxTouchPoints > 0
	)
}

/**
 * Функция для скрытия панели управления и курсора
 * @returns {void}
 */
const hideControls = () => {
	controlPanel.classList.add('hide')
	timePreview.classList.add('hide')
	alsVPlayer.style.cursor = 'none'
	controlPanel.classList.remove('visible')
	if (!isTouchDevice()) {
		controlPanel.classList.remove('visible')
	}
}

/**
 * Функция для остановки таймера мыши
 * @returns {void}
 */
const stopMouseTimer = () => {
	clearTimeout(mouseTimer)
	controlPanel.classList.remove('hide')
	timePreview.classList.remove('hide')
	alsVPlayer.style.cursor = 'auto'
	if (!isTouchDevice()) {
		controlPanel.classList.add('visible')
	}
}

/**
 * Функция для сброса таймера мыши
 * @returns {void}
 */
const resetMouseTimer = () => {
	if (!video.paused) {
		stopMouseTimer()

		// Устанавливаем новый таймер
		mouseTimer = setTimeout(hideControls, 3000)
	}
}

/**
 * Форматирует время в формате "чч:мм:сс" или "мм:сс"
 * @param {number} seconds - Время в секундах
 * @returns {string} - Форматированная строка времени
 */
const formatTime = seconds => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)

	// Форматируем строки, добавляя ведущие нули для минут и секунд
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
	const formattedSeconds = secs < 10 ? `0${secs}` : secs

	// Если часы больше 0, возвращаем формат "чч:мм:ss", иначе "мм:ss"
	return hours > 0
		? `${hours}:${formattedMinutes}:${formattedSeconds}`
		: `${formattedMinutes}:${formattedSeconds}`
}

/**
 * Останавливает воспроизведение видео и показывает элементы управления
 * @returns {void}
 */
const pauseVideo = () => {
	video.pause()
	controlPanel.classList.add('visible')
	btnPlayPause.classList.remove('pause')
	stopMouseTimer()
}

/**
 * Обрабатывает клик по видео для мобильных устройств
 * @returns {void}
 */
const clickOnVideoMobile = () => {
	if (video.paused) {
		video.play()
		btnPlayPause.classList.add('pause')
	} else {
		if (controlPanel.classList.contains('visible')) {
			video.pause()
			controlPanel.classList.add('visible')
			btnPlayPause.classList.remove('pause')
			stopMouseTimer()
		} else {
			controlPanel.classList.add('visible')
		}
	}

	resetMouseTimer()
}

/**
 * Переключает состояние воспроизведения видео
 * @returns {void}
 */
const togglePlayPause = () => {
	if (video.paused) {
		video.play()
		btnPlayPause.classList.add('pause')
		controlPanel.classList.remove('visible')
		controlPanel.classList.add('hide')
		timePreview.classList.add('hide')
		alsVPlayer.style.cursor = 'none'
	} else {
		pauseVideo()
	}

	resetMouseTimer()
}

/**
 * Обновляет позицию видео и прогресс-бара
 * @returns {void}
 */
const videoPositionUpdate = () => {
	const timeLinePosition = (video.currentTime / video.duration) * 100
	timeLine.style.width = `${timeLinePosition}%`

	if (video.ended) {
		btnPlayPause.classList.remove('pause')
		controlPanel.classList.remove('hide')
		alsVPlayer.style.cursor = 'auto'
		clearTimeout(mouseTimer)
	}
}

/**
 * Перематывает видео назад на 10 секунд
 * @returns {void}
 */
const videoPositionReplay = () => {
	video.currentTime = Math.max(0, video.currentTime - 10)
	resetMouseTimer()
}

// Увеличивает текущее время видео на 10 секунд
/**
 * Перематывает видео вперед на 10 секунд
 * @returns {void}
 */
const videoPositionForward = () => {
	video.currentTime = Math.min(video.duration, video.currentTime + 10)
	resetMouseTimer()
}

/**
 * Обновляет класс кнопки громкости в зависимости от текущего уровня громкости
 * @returns {void}
 */
const updateVolumeButtonClass = () => {
	btnVolume.classList.remove('max', 'min', 'off')
	if (video.volume === 0) {
		btnVolume.classList.add('off')
	} else if (video.volume < 0.65) {
		btnVolume.classList.add('min')
	} else {
		btnVolume.classList.add('max')
	}
}

/**
 * Запрашивает переход в полноэкранный режим
 * @returns {void}
 */
const goFullScreen = () => {
	if (alsVPlayer.requestFullscreen) {
		alsVPlayer.requestFullscreen()
		// @ts-ignore
	} else if (alsVPlayer.mozRequestFullScreen) {
		// @ts-ignore
		alsVPlayer.mozRequestFullScreen() // Firefox
		// @ts-ignore
	} else if (alsVPlayer.webkitRequestFullscreen) {
		// @ts-ignore
		alsVPlayer.webkitRequestFullscreen() // Chrome, Safari & Opera
		// @ts-ignore
	} else if (alsVPlayer.msRequestFullscreen) {
		// @ts-ignore
		alsVPlayer.msRequestFullscreen() // IE/Edge
	}
}

/**
 * Переключает полноэкранный режим
 * @returns {void}
 */
const toggleFullscreen = () => {
	if (!document.fullscreenElement) {
		goFullScreen()
	} else {
		document.exitFullscreen()
	}
	resetMouseTimer()
}

// Обработка клика по видео
video.addEventListener('click', () => {
	if (!isTouchDevice()) togglePlayPause()
	if (isTouchDevice()) clickOnVideoMobile()
})

// Отображает общую длину и текущее время видео
video.addEventListener('loadedmetadata', () => {
	durationTime.textContent = formatTime(video.duration)
	currentTime.textContent = formatTime(video.currentTime)
})

// Обновляет текущее время во время воспроизведения
video.addEventListener('timeupdate', () => {
	currentTime.textContent = formatTime(video.currentTime)
})

// Устанавливает текущее время видео при клике на прогресс бар
timeBar.addEventListener('click', event => {
	const rect = timeBar.getBoundingClientRect()
	const clickPercentage = (event.clientX - rect.left) / rect.width
	video.currentTime = clickPercentage * video.duration
})

// Отображает время при наведении на прогресс бар
timeBar.addEventListener('mousemove', event => {
	const rect = timeBar.getBoundingClientRect()
	const hoverPercentage = (event.clientX - rect.left) / rect.width
	const previewTime = hoverPercentage * video.duration

	timePreview.textContent = formatTime(Math.max(previewTime, 0))

	// Центрирует таймпровью относительно курсора
	let positionTimePreview =
		event.clientX - rect.left - timePreview.offsetWidth / 2

	// Ограничивает позицию таймпровью
	positionTimePreview = Math.max(
		0,
		Math.min(positionTimePreview, rect.width - timePreview.offsetWidth)
	)

	// Устанавливает скорректированную позицию таймпровью
	timePreview.style.transform = `translateX(${positionTimePreview}px)`
})

// Обработчик события для кнопки звука
btnVolume.addEventListener('click', () => {
	if (video.volume > 0) {
		video.volume = 0
		inputVolumeControl.value = '0'
		updateVolumeButtonClass()
	} else {
		video.volume = currentVolume
		inputVolumeControl.value = String(currentVolume * 100)
		updateVolumeButtonClass()
	}
	resetMouseTimer()
})

// Обработчик события input для изменения громкости
inputVolumeControl.addEventListener('input', () => {
	video.volume = currentVolume = Number(inputVolumeControl.value) / 100
	updateVolumeButtonClass()
})

// Обработчик события change для изменения громкости
inputVolumeControl.addEventListener('change', () => {
	video.volume = currentVolume = Number(inputVolumeControl.value) / 100
	updateVolumeButtonClass()
})

// Обработка событий
alsVPlayer.addEventListener('mousemove', resetMouseTimer)
video.addEventListener('timeupdate', videoPositionUpdate)
video.addEventListener('play', resetMouseTimer)
btnPlayPause.addEventListener('click', togglePlayPause)
btnReplay.addEventListener('click', videoPositionReplay)
btnForward.addEventListener('click', videoPositionForward)
btnFullscreen.addEventListener('click', toggleFullscreen)

// Обработчик события изменения иконки "полноэкранного режима"
document.addEventListener('fullscreenchange', () => {
	btnFullscreen.classList.toggle('off', !!document.fullscreenElement)
})

// Обработка нажатий клавиш клавиатуры
if (!isTouchDevice()) {
	document.addEventListener('keydown', function (event) {
		switch (event.code) {
			case 'ArrowRight':
				// Перемотка на 10 секунд вперед
				video.currentTime += 10
				stopMouseTimer()
				resetMouseTimer()
				break
			case 'ArrowLeft':
				// Перемотка на 10 секунд назад
				video.currentTime -= 10
				stopMouseTimer()
				resetMouseTimer()
				break
			case 'Space':
				// Предотвращает стандартное поведение пробела, чтобы избежать прокрутки страницы
				event.preventDefault()
				// Пауза или воспроизведение видео
				togglePlayPause()
				break
			case 'ArrowUp':
				stopMouseTimer()
				resetMouseTimer()
				if (!video.paused) {
					// Предотвращает стандартное поведение пробела, чтобы избежать прокрутки страницы
					event.preventDefault()
					// Увеличение громкости на 10%
					if (video.volume < 1) {
						video.volume = Math.min(video.volume + 0.1, 1)
						inputVolumeControl.value = String(video.volume * 100)
						currentVolume = video.volume
						updateVolumeButtonClass()
					}
				}
				break
			case 'ArrowDown':
				stopMouseTimer()
				resetMouseTimer()
				if (!video.paused) {
					// Предотвращает стандартное поведение пробела, чтобы избежать прокрутки страницы
					event.preventDefault()
					// Уменьшение громкости на 10%
					if (video.volume > 0) {
						video.volume = Math.max(video.volume - 0.1, 0)
						inputVolumeControl.value = String(video.volume * 100)
						currentVolume = video.volume
						updateVolumeButtonClass()
					}
				}
				break
		}
	})
}

// Обработка нажатия кнопки переключения на аудио карточку
if (btnOnAudio) btnOnAudio.addEventListener('click', pauseVideo)
