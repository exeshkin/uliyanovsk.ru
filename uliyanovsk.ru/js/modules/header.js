import t from '/js/utils/getDataJson.js'
import e from '/js/utils/getDate.js'
import { getDateFromId as n } from '/js/utils/getDateFromId.js'
async function s() {
	const e = document.querySelector('header.header')
	if (!e)
		return void console.error('header.js: элемент header.header не найден')
	if (null !== e.querySelector('.header__inner')) {
		try {
			const n = await t('/data/ministers.json'),
				s = e.querySelectorAll('.header__sub-menu-list')[0]
			s &&
				(s.querySelectorAll('.header__sub-menu-item').forEach(t => t.remove()),
				Object.entries(n).forEach(([t, e]) => {
					const n = document.createElement('li')
					;((n.className = 'header__sub-menu-item'),
						(n.innerHTML = `<a class="header__sub-menu-link" href="${e.link}">${t}</a>`),
						s.appendChild(n))
				}))
		} catch (t) {
			console.error('Ошибка загрузки ministers.json:', t)
		}
		return
	}
	let n = ''
	try {
		const e = await t('/data/ministers.json')
		n = Object.entries(e)
			.map(
				([t, e]) =>
					`\n\t\t\t\t\t\t\t<li class="header__sub-menu-item">\n\t\t\t\t\t\t\t\t<a class="header__sub-menu-link" href="${e.link}">${t}</a>\n\t\t\t\t\t\t\t</li>`,
			)
			.join('')
	} catch (t) {
		console.error('Ошибка загрузки ministers.json:', t)
	}
	try {
		e.innerHTML = `\n\t<div class="container">\n\t\t<div class="header__inner">\n\t\t\t<a class="header__logo-text" href="/">Общение Христиан</a>\n\t\t\t<div class="header__logo-img">\n\t\t\t\t<a href="/"><img src="img/logo.svg" alt="Логотип" width="48" height="48" /></a>\n\t\t\t</div>\n\t\t\t<nav class="header__menu">\n\t\t\t\t<ul class="header__menu-list">\n\t\t\t\t\t<div class="header__menu-titte">Меню</div>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link" href="/">Главная</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link-with-submenu">\n\t\t\t\t\t\t\t<span>Служение</span>\n\t\t\t\t\t\t\t<img class="header__menu-arrow" src="img/icon/arrow-down.svg" alt="открыть подменю" width="16" height="16" />\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<ul class="header__sub-menu-list">\n\t\t\t\t\t\t\t<div class="header__back-to-menu">\n\t\t\t\t\t\t\t\t<img class="header__menu-arrow" src="img/icon/arrow-down.svg" alt="назад" width="16" height="16" /><span>Меню</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="header__menu-titte">Служение</div>\n\t\t\t\t\t\t\t${n}\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link-with-submenu">\n\t\t\t\t\t\t\t<span>Послание</span>\n\t\t\t\t\t\t\t<img class="header__menu-arrow" src="img/icon/arrow-down.svg" alt="открыть подменю" width="16" height="16" />\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<ul class="header__sub-menu-list">\n\t\t\t\t\t\t\t<div class="header__back-to-menu">\n\t\t\t\t\t\t\t\t<img class="header__menu-arrow" src="img/icon/arrow-down.svg" alt="назад" width="16" height="16" /><span>Меню</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="header__menu-titte">Послание</div>\n\t\t\t\t\t\t\t<li class="header__sub-menu-item">\n\t\t\t\t\t\t\t\t<a class="header__sub-menu-link" href="message-years-1947-1957.html">1947-1957</a>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li class="header__sub-menu-item">\n\t\t\t\t\t\t\t\t<a class="header__sub-menu-link" href="message-years-1958-1962.html">1958-1962</a>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li class="header__sub-menu-item">\n\t\t\t\t\t\t\t\t<a class="header__sub-menu-link" href="message-years-1963-1965.html">1963-1965</a>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link" href="worship.html">\n\t\t\t\t\t\t\t<span>Поклонение</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link" href="photo-list.html">Фото</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link" href="video-list.html">Видео</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<a class="header__menu-link" href="streamvideo.html">\n\t\t\t\t\t\t\t<span class="header__menu-link-stream">\n\t\t\t\t\t\t\t\tТрансляция\n\t\t\t\t\t\t\t\t<span class="header__menu-stream-led"></span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="header__menu-item">\n\t\t\t\t\t\t<div class="header__menu-link header__menu-link-search">Поиск</div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</nav>\n\t\t\t<div class="header__menu-icon">\n\t\t\t\t<span class="header__menu-icon-span"></span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class="breadcrumbs">\n\t\t\x3c!-- JSON --\x3e\n\t</div>\n`
	} catch (t) {
		console.error('Ошибка при рендере шапки:', t)
	}
}
function a() {
	const t = document.querySelector('footer.footer')
	t &&
		(t.innerHTML =
			'\n\t<div class="container">\n\t\t<div class="footer__inner">\n\t\t\t<nav class="footer__menu">\n\t\t\t\t<a class="footer__menu-link" href="contacts.html">\n\t\t\t\t\t<img class="icon-contacts" src="img/icon/contact.svg" alt="Связаться с нами" width="20" height="20">\n\t\t\t\t\t<span>Связаться с нами</span>\n\t\t\t\t</a>\n\t\t\t</nav>\n\t\t\t<div class="footer__copyright">2010-<span id="year"></span> | © "Общение христиан" | г. Ульяновск</div>\n\t\t</div>\n\t</div>\n')
}
function r() {
	const t = document.querySelector('div.search')
	t &&
		(t.querySelector('.search__inner-form') ||
			(t.innerHTML =
				'\n\t<div class="container container-search">\n\t\t<div class="search__inner-form">\n\t\t\t<span class="search__close"></span>\n\t\t\t<h2 class="search__title">Поиск по сайту</h2>\n\t\t\t<form class="search__form" action="#" id="search-form">\n\t\t\t\t<div class="search__input-container">\n\t\t\t\t\t<label for="search">\n\t\t\t\t\t\t<input class="search__input" type="text" id="search" />\n\t\t\t\t\t\t<span class="search__input-clear"></span>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t\t<div class="search__inner-result">\n\t\t\t<div class="search__result">\n\t\t\t\t\x3c!-- JSON --\x3e\n\t\t\t</div>\n\t\t</div>\n\t</div>\n'))
}
function i() {
	const t = document.querySelector('div.password')
	t &&
		(t.querySelector('.password__container') ||
			(t.innerHTML =
				'\n\t<div class="password__container">\n\t\t<div class="password__inner">\n\t\t\t<h2 class="password__title">Доступ к сайту</h2>\n\t\t\t<p class="password__text">\n\t\t\t\tCайт защищён паролем. Чтобы его просматривать, введите пароль:\n\t\t\t</p>\n\t\t\t<form class="password__form" action="#" method="post">\n\t\t\t\t<input class="password__form-input" id="passwordSite" type="password" name="password">\n\t\t\t\t<button class="password__button" type="submit">Войти</button>\n\t\t\t</form>\n\t\t\t<p class="password__text postscript">\n\t\t\t\tЕсли у вас нет пароля, вы можете запросить его у нас. Напишите нам на электронную почту: <a\n\t\t\t\t\tclass="password__link" href="mailto:site@uliyanovsk.ru">site@uliyanovsk.ru</a>\n\t\t\t</p>\n\t\t</div>\n\t</div>\n'))
}
function c() {
	const s = document.querySelector('.body'),
		a = document.querySelector('.header__menu-link-search'),
		r = document.querySelector('.search'),
		i = document.querySelector('.search__close'),
		c = document.querySelector('.search__input-container'),
		l = document.querySelector('.search__input'),
		o = document.querySelector('.search__input-clear'),
		d = document.querySelector('.search__inner-result'),
		_ = document.querySelector('.search__result'),
		m = document.querySelector('.header__menu-icon'),
		u = document.querySelector('.header__menu'),
		h = document.querySelector('.breadcrumbs')
	if (!a || !r || !l) return
	const v = (t, s, a, r, i) => {
		const c = document.createElement('a')
		;((c.classList = `search__link ${a}`),
			c.setAttribute('href', `${r}.html?id=${s}`))
		const l = 'Уилльям Маррион Бранхам' === i ? n(s) : e(t, s),
			o =
				'Уилльям Маррион Бранхам' === i
					? 'Уилльям Маррион Бранхам'
					: `${t[s][i]}`
		;((c.innerHTML = `${l} «${t[s].name}» - ${o}`), _.appendChild(c))
	}
	;(a.addEventListener('click', () => {
		;(m.classList.remove('_active'),
			(m.style.opacity = 1),
			u.classList.remove('_active'),
			(m.style.pointerEvents = 'auto'),
			(r.style.display = 'flex'),
			setTimeout(() => {
				;(r.classList.add('_active'),
					h.classList.add('_close'),
					(s.style.overflow = 'hidden'),
					(l.value = ''))
			}, 100))
	}),
		i.addEventListener('click', () => {
			;(r.classList.remove('_active'),
				s.style.removeProperty('overflow'),
				h.classList.remove('_close'),
				d.classList.remove('_active'),
				setTimeout(() => {
					r.style.removeProperty('display')
				}, 300))
		}),
		l.addEventListener('input', () => {
			var e
			;(c.classList.add('_active'),
				(_.innerHTML = ''),
				l.value.length > 2
					? (d.classList.add('_active'),
						(e = l.value),
						Promise.all([t('/data/services.json'), t('/data/message.json')])
							.then(([t, n]) => {
								const s = Object.keys(t),
									a = Object.keys(n)
								for (let n of s)
									(t[n].name.toLowerCase().includes(e.toLowerCase()) ||
										t[n].minister.toLowerCase().includes(e.toLowerCase())) &&
										v(t, n, 'search__link-services', 'services', 'minister')
								for (let t of a)
									n[t].name.toLowerCase().includes(e.toLowerCase()) &&
										v(
											n,
											t,
											'search__link-message',
											'message',
											'Уилльям Маррион Бранхам',
										)
								'' === _.innerHTML &&
									(_.innerHTML =
										'Поиск не дал результатов, попробуйте ввести другой запрос')
							})
							.catch(t => {
								console.error('Ошибка при загрузке данных:', t)
							}))
					: (d.classList.remove('_active'),
						l.value.length < 1 && c.classList.remove('_active')))
		}),
		o.addEventListener('click', () => {
			;(c.classList.remove('_active'),
				d.classList.remove('_active'),
				(l.value = ''),
				l.focus())
		}))
}
;((window.headerReady = !1),
	(async () => {
		try {
			;(await s(),
				a(),
				r(),
				i(),
				c(),
				(window.headerReady = !0),
				document.dispatchEvent(new CustomEvent('headerReady')))
		} catch (t) {
			;(console.error('header.js: критическая ошибка при инициализации:', t),
				(window.headerReady = !0),
				document.dispatchEvent(new CustomEvent('headerReady')))
		}
	})(),
	setTimeout(() => {
		const t = document.querySelector('header.header')
		;(t && '' !== t.innerHTML.trim()) ||
			(console.warn(
				'header.js: таймаут — шапка не отрендерена, принудительная инициализация',
			),
			s()
				.then(() => {
					;(a(),
						r(),
						i(),
						c(),
						(window.headerReady = !0),
						document.dispatchEvent(new CustomEvent('headerReady')))
				})
				.catch(t => {
					;(console.error(
						'header.js: ошибка при принудительной инициализации:',
						t,
					),
						(window.headerReady = !0),
						document.dispatchEvent(new CustomEvent('headerReady')))
				}))
	}, 5e3))
