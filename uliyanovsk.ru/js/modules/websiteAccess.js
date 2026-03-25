import getDataJson from '/js/utils/getDataJson.js'

const urlKey = '/data/key.json'
const strReplace = (str) => str.replace(/[^a-zа-яё0-9\\s]/gi, '')

const websiteAccess = () => {
	const body = document.querySelector('.body')
	const password = document.querySelector('.password')
	const passwordForm = document.querySelector('.password__form')
	const passwordFormInput = document.querySelector('.password__form-input')

	let siteKey = ''

	const access = (str) => {
		password.classList.add('_access')
		localStorage.s = str
		setTimeout(() => {
			password.style.display = 'none'
			body.style.overflow = 'auto'
		}, 300)
	}

	const close = () => {
		body.style.overflow = 'hidden'
		password.style.display = 'flex'
	}

	const errorPassword = () => {
		passwordFormInput.classList.add('_error')
	}

	const chekPassword = (e) => {
		e.preventDefault()
		if (passwordFormInput.value === strReplace(siteKey)) {
			access(strReplace(siteKey))
		} else {
			errorPassword()
		}
	}

	const chekPasswordLocalStorage = (key) => {
		if (localStorage.s === strReplace(key)) {
			access(strReplace(key))
		} else {
			close()
		}
	}

	getDataJson(urlKey)
		.then(data => {
			siteKey = data.key
			chekPasswordLocalStorage(siteKey)
			passwordForm.addEventListener('submit', chekPassword)
		})
		.catch(error => {
			console.error('websiteAccess: ошибка загрузки key.json:', error)
			// Если не удалось загрузить ключ — показываем парольный блок
			close()
		})
}

const websiteAccessContacts = () => {
	const footerMenuLinks = document.querySelectorAll('.footer__menu-link')

	const footerMenuPointerEventsAuto = () => {
		for (const footerMenuLink of footerMenuLinks) {
			footerMenuLink.style.pointerEvents = 'auto'
		}
	}

	const footerMenuPointerEventsNone = () => {
		for (const footerMenuLink of footerMenuLinks) {
			footerMenuLink.style.pointerEvents = 'none'
		}
	}

	getDataJson(urlKey)
		.then(data => {
			const key = data.key
			if (localStorage.s === strReplace(key)) {
				footerMenuPointerEventsAuto()
			} else {
				footerMenuPointerEventsNone()
			}
		})
		.catch(error => {
			console.error('websiteAccessContacts: ошибка загрузки key.json:', error)
			// Если не удалось загрузить ключ — блокируем ссылки
			footerMenuPointerEventsNone()
		})
}

// Запрос и обработка пароля
export { websiteAccess, websiteAccessContacts }
