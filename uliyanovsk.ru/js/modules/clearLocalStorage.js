// функция удаляет записи из LocalStorage старше 30 дней
const clearLocalStorage = () => {
	const thresholdTime = 30 * 24 * 60 * 60 * 1000 // 30 дней в миллисекундах
	const now = Date.now()

	// перебирает все записи в LocalStorage
	// и удаляет записи старше 30 дней
	Object.keys(localStorage).forEach(key => {
		if (key.match(/videoProgress|audioProgress/)) {
			const keyValue = localStorage.getItem(key)
			const timeKeyValue = keyValue.split('_')[0]

			if (now - timeKeyValue > thresholdTime) localStorage.removeItem(key)
		}
	})
}

export default clearLocalStorage
