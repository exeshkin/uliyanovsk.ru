import { websiteAccessContacts as e } from '/js/modules/websiteAccess.js'
import { bodySizeLoad as t, bodyResize as s } from '/js/modules/sizeWindow.js'
import r from '/js/modules/onloadImgs.js'
import {
	onOfSubmenu as o,
	closeMenuClickAway as n,
	onOfMenu as a,
} from '/js/modules/menuAction.js'
import c from '/js/modules/onOffStreamLed.js'
import l from '/js/modules/yearInFooter.js'

let d = !1
const i = () => {
	if (d) return
	d = !0

	document.querySelector('.breadcrumbs').innerHTML =
		'\n\t\t<div class="breadcrumbs__inner">\n\t\t\t<a class="breadcrumbs__item breadcrumbs__link" href="/">\n\t\t\t\t<span>Главная</span><img class="breadcrumbs__arrow json" src="img/icon/arrow-right.svg" alt="" width="16" height="16" aria-hidden="true"></img>\n\t\t\t</a>\n\t\t\t<div class="breadcrumbs__item">Связаться с нами</div>\n\t\t</div>\n\t\t<div class="breadcrumbs__fon-extra"></div>'
	;(e(),
		t(),
		s(),
		r(),
		a(),
		o(),
		n(),
		c(),
		l(),
		setTimeout(() => {
			const e = document.querySelector('.mask')
			e &&
				!e.classList.contains('_hide') &&
				(console.warn('contacts: Loader timeout — принудительное закрытие'),
				e.classList.add('_hide'),
				setTimeout(() => {
					e.remove()
				}, 600))
		}, 1e4))
}

window.headerReady
	? i()
	: (document.addEventListener('headerReady', i),
		setTimeout(() => {
			d ||
				(console.warn(
					'contacts.js: таймаут ожидания headerReady — принудительная инициализация',
				),
				i())
		}, 5e3))
