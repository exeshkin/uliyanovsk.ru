// @ts-check

/**
 * Общие функции управления плеером для service.js и message.js:
 * - переключение видео/аудио (3D-анимация)
 * - сохранение и восстановление прогресса в localStorage
 * - навешивание обработчиков событий плееров и кнопок
 */

import { btnOnAudio, btnOnVideo } from '../utils/btnsVideoAudio.js'
import { scrollToTop } from './buttonToUp.js'

/**
 * Инициализирует управление плеером.
 * @param {string} urlId - Ключ записи (id из URL)
 * @returns {void}
 */
export const initPlayerControls = (urlId) => {
	const videoPlayer = /** @type {HTMLVideoElement} */ (
		document.getElementById('avp-video')
	)
	const audioPlayer = /** @type {HTMLAudioElement} */ (
		document.getElementById('audioPlayer')
	)
	const videoCard = /** @type {HTMLDivElement} */ (
		document.querySelector('.preaching-article__video-card')
	)
	const audioCard = /** @type {HTMLDivElement} */ (
		document.querySelector('.preaching-article__audio-card')
	)
	const cards = /** @type {HTMLDivElement} */ (
		document.querySelector('.preaching-article__cards')
	)
	const containersRotatable = /** @type {NodeListOf<HTMLElement>} */ (
		document.querySelectorAll('.rotatable')
	)
	const buttonToTop = /** @type {HTMLButtonElement} */ (
		document.querySelector('.button-to-top')
	)

	const entryNameVideoProgress = `videoProgress_${urlId}`
	const entryNameAudioProgress = `audioProgress_${urlId}`

	// --- Прогресс ---

	const updateProgressVideo = () => {
		localStorage.setItem(
			entryNameVideoProgress,
			`${Date.now()}_${videoPlayer.currentTime}`
		)
	}

	const updateProgressAudio = () => {
		localStorage.setItem(
			entryNameAudioProgress,
			`${Date.now()}_${audioPlayer.currentTime}`
		)
	}

	const restoreProgressVideoAudio = () => {
		const storedProgressVideo = localStorage.getItem(entryNameVideoProgress)
		const storedProgressAudio = localStorage.getItem(entryNameAudioProgress)

		if (storedProgressVideo !== null)
			videoPlayer.currentTime = Number(storedProgressVideo.split('_')[1])

		if (storedProgressAudio !== null)
			audioPlayer.currentTime = Number(storedProgressAudio.split('_')[1])
	}

	// --- Переключение видео/аудио ---

	const enableAudio = () => {
		// 3d-анимация
		for (let container of containersRotatable) {
			container.style.transform = 'translateZ(30px)'

			setTimeout(() => {
				videoCard.style.pointerEvents = 'none'
				videoCard.style.zIndex = '0'
				audioCard.style.pointerEvents = 'all'
				audioCard.style.zIndex = '10'
				container.style.transform = 'translateZ(0)'
			}, 1200)
		}

		setTimeout(() => {
			cards.classList.add('card-audio')
		}, 500)

		localStorage.setItem('videoOrAudio', 'audio')
	}

	const enableVideo = () => {
		if (!audioPlayer.paused) {
			audioPlayer.pause()
		}

		// 3d-анимация
		for (let container of containersRotatable) {
			container.style.transform = 'translateZ(30px)'

			setTimeout(() => {
				audioCard.style.pointerEvents = 'none'
				audioCard.style.zIndex = '0'
				videoCard.style.pointerEvents = 'all'
				videoCard.style.zIndex = '10'
				container.style.transform = 'translateZ(0)'
			}, 1200)
		}

		setTimeout(() => {
			cards.classList.remove('card-audio')
		}, 500)

		localStorage.setItem('videoOrAudio', 'video')
	}

	// --- Инициализация ---

	// работа с localStorage: если пусто — установить видео
	if (localStorage.getItem('videoOrAudio') == null) {
		localStorage.setItem('videoOrAudio', 'video')
	}

	// перевернуть карточку на аудио, если в localStorage аудио
	if (localStorage.getItem('videoOrAudio') == 'audio') {
		enableAudio()
	}

	// восстанавливает прогресс
	restoreProgressVideoAudio()

	// обработчики прогресса видео
	videoPlayer.addEventListener('timeupdate', updateProgressVideo)
	videoPlayer.addEventListener('pause', updateProgressVideo)
	videoPlayer.addEventListener('ended', updateProgressVideo)

	// обработчики прогресса аудио
	audioPlayer.addEventListener('timeupdate', updateProgressAudio)
	audioPlayer.addEventListener('pause', updateProgressAudio)
	audioPlayer.addEventListener('ended', updateProgressAudio)

	// кнопки переключения
	btnOnAudio.addEventListener('click', enableAudio)
	btnOnVideo.addEventListener('click', enableVideo)

	// плавный скрол вверх
	buttonToTop.addEventListener('click', scrollToTop)
}
