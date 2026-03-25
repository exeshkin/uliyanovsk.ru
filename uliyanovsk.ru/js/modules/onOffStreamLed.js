import getDataJson from '/js/utils/getDataJson.js'

// функция проверяет статус трансляции
const statusStream = (ledStream) => {
	setInterval(() => {
		getDataJson(`/data/stream.json`)
			.then(data => {
				const stream = data.stream.onOff
				if (stream != '' && !ledStream.classList.contains('_on')) {
					ledStream.classList.add('_on')
				} else if (stream === '' && ledStream.classList.contains('_on')) {
					ledStream.classList.remove('_on')
				}
			})
			.catch(error => console.log(error.message))
	}, 30000)
}

// функция включает(выключает) диод на Трансляции
function onOffStreamLed() {
	const ledStream = document.querySelector('.header__menu-stream-led')

	getDataJson(`/data/stream.json`)
		.then(data => {
			const stream = data.stream.onOff
			if (stream != '') {
				ledStream.classList.add('_on')
			}
			statusStream(ledStream)
		})
		.catch(error => console.log(error.message))
}

export default onOffStreamLed