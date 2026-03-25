const buttonToTop = document.querySelector('.button-to-top')

// функция включает кнопку 'вернуться наверх'
const onOffButtonToUp = () => {
	window.addEventListener('scroll', function () {
		if (window.scrollY > 230) {
			buttonToTop.style.opacity = 1
			buttonToTop.style.pointerEvents = 'auto'
		} else {
			buttonToTop.style.opacity = 0
			buttonToTop.style.pointerEvents = 'none'
		}
	})
}

// плавный скрол вверх за 1 секунду до верха
const scrollToTop = () => {
	const duration = 1000 // Длительность анимации в миллисекундах
	const start = window.scrollY // Начальная позиция
	const startTime = performance.now() // Время начала анимации

	function animation(currentTime) {
		const elapsed = currentTime - startTime // Прошедшее время
		const progress = Math.min(elapsed / duration, 1) // Прогресс от 0 до 1

		// Интерполяция для плавного скролла
		const easeInOutQuad =
			progress < 0.5
				? 2 * progress * progress
				: -1 + (4 - 2 * progress) * progress

		window.scrollTo(0, start * (1 - easeInOutQuad)) // Скроллим

		if (progress < 1) {
			requestAnimationFrame(animation) // Запрашиваем следующий кадр
		}
	}

	requestAnimationFrame(animation) // Запускаем анимацию
}

// плавный скрол вверх за 1 секунду до header
const scrollToHeaderBottom = () => {
	const header = document.querySelector('header')
	const headerBottom = header.offsetTop + header.offsetHeight
	const duration = 1000 // Длительность анимации в миллисекундах
	const start = window.scrollY // Начальная позиция
	const startTime = performance.now() // Время начала анимации

	function animation(currentTime) {
		const elapsed = currentTime - startTime // Прошедшее время
		const progress = Math.min(elapsed / duration, 1) // Прогресс от 0 до 1

		// Интерполяция для плавного скролла
		const easeInOutQuad =
			progress < 0.5
				? 2 * progress * progress
				: -1 + (4 - 2 * progress) * progress

		window.scrollTo(0, start + (headerBottom - start) * easeInOutQuad) // Скроллим до нижнего края блока header

		if (progress < 1) {
			requestAnimationFrame(animation) // Запрашиваем следующий кадр
		}
	}

	requestAnimationFrame(animation) // Запускаем анимацию
}

export { onOffButtonToUp, scrollToTop, scrollToHeaderBottom }
