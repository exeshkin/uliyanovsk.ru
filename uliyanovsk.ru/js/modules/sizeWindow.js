// функция определяет ширину экрана и устанавливает класс
const bodySizeLoad = () => {
	const body = document.querySelector('.body')
	body.classList.remove('_pc')
	body.classList.remove('_touch')
	if (document.documentElement.clientWidth < 1000) {
		body.classList.add('_touch')
	} else {
		body.classList.add('_pc')
	}
}

// функция определяет ширину экрана при ресайзе страницы и устанавливает класс
const bodyResize = () => {
	window.addEventListener('resize', () => {
		const body = document.querySelector('.body')
		const menu = document.querySelector('.header__menu')
		const burger = document.querySelector('.header__menu-icon')
		const menuItems = document.querySelectorAll('.header__menu-item')
		menu.classList.remove('_active')
		bodySizeLoad()
		body.style.removeProperty('overflow')
		for (let menuItem of menuItems) {
			menuItem.classList.remove('_active')
			burger.classList.remove('_active')
			burger.style.opacity = 1
			burger.style.pointerEvents = 'auto'
		}
	}, false)
}

export { bodySizeLoad, bodyResize }