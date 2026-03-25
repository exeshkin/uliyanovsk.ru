// функция открывает(закрывает) сабменю
const onOfSubmenu = () => {
	const body = document.querySelector('.body')
	const burger = document.querySelector('.header__menu-icon')
	const menuItems = document.querySelectorAll('.header__menu-item')
	const subMenuLinks = document.querySelectorAll('.header__menu-link-with-submenu')
	const backToMenus = document.querySelectorAll('.header__back-to-menu')

	for (let subMenuLink of subMenuLinks) {
		subMenuLink.addEventListener('click', () => {
			if (body.classList.contains('_touch')) {
				subMenuLink.parentElement.classList.add('_active')
				burger.style.opacity = 0
				burger.style.pointerEvents = 'none'
			}
		})
	}
	for (let backToMenu of backToMenus) {
		backToMenu.addEventListener('click', () => {
			for (let menuItem of menuItems) {
				menuItem.classList.remove('_active')
				burger.style.opacity = 1
				burger.style.pointerEvents = 'auto'
			}
		})
	}
}

// функция закрывает меню-бургер при клике мимо меню
const closeMenuClickAway = () => {
	const body = document.querySelector('.body')
	const burger = document.querySelector('.header__menu-icon')
	const menuItems = document.querySelectorAll('.header__menu-item')
	const menu = document.querySelector('.header__menu')
	document.addEventListener('click', event => {
		const iconMenuSpan = document.querySelector('.header__menu-icon-span')
		const menu_is_active = menu.classList.contains('_active')
		let target = event.target
		let its_menu = target == menu || menu.contains(target)
		let its_iconMenu = target == burger
		let its_iconMenuSpan = target == iconMenuSpan
		if (!its_menu && !its_iconMenu && !its_iconMenuSpan && menu_is_active) {
			burger.classList.remove('_active')
			burger.style.opacity = 1
			menu.classList.remove('_active')
			body.style.removeProperty('overflow')
			burger.style.pointerEvents = 'auto'
			for (let menuItem of menuItems) {
				menuItem.classList.remove('_active')
				burger.style.opacity = 1
			}
		}
	})
}

// функция открывает(закрывает) меню бургер
const onOfMenu = () => {
	const body = document.querySelector('.body')
	const burger = document.querySelector('.header__menu-icon')
	const menu = document.querySelector('.header__menu')
	burger.addEventListener('click', () => {
		menu.classList.toggle('_active')
		burger.classList.toggle('_active')
		if (menu.classList.contains('_active')) {
			body.style.overflow = 'hidden'
		} else {
			body.style.removeProperty('overflow')
		}
	})
}

export { onOfSubmenu, closeMenuClickAway, onOfMenu }