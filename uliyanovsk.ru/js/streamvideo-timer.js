async function fetchEndTime() {
	try {
		const response = await fetch(`/data/stream.json?t=${new Date().getTime()}`)
		const data = await response.json()
		return new Date(data.next_stream + ' GMT+4')
	} catch (error) {
		console.error('Ошибка при загрузке времени:', error)
		return null
	}
}

async function fetchNextBroadcast() {
	try {
		const response = await fetch(`/data/stream.json?t=${new Date().getTime()}`)
		const data = await response.json()
		return new Date(data.next_stream + ' GMT+4')
	} catch (error) {
		console.error('Ошибка при загрузке следующей трансляции:', error)
		return null
	}
}

function getDeclension(number, words) {
	if (number % 10 === 1 && number % 100 !== 11) {
		return words[0] // 1 день
	} else if (
		number % 10 >= 2 &&
		number % 10 <= 4 &&
		(number % 100 < 10 || number % 100 >= 20)
	) {
		return words[1] // 2 дня, 3 дня, 4 дня
	} else {
		return words[2] // 5 дней и больше
	}
}

function updateCountdown(endTime) {
	const countdownElement = document.getElementById('countdown')
	const interval = setInterval(() => {
		const now = new Date()
		const remainingTime = endTime - now

		if (remainingTime <= 0) {
			clearInterval(interval)
			countdownElement.textContent = 'Загрузка...'
			return
		}

		const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
		const hours = Math.floor(
			(remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		)
		const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))

		let countdownText = ''

		if (days > 0) {
			const dayWord = getDeclension(days, ['день', 'дня', 'дней'])
			countdownText += `${days} ${dayWord} `
		}

		if (hours > 0) {
			const hourWord = getDeclension(hours, ['час', 'часа', 'часов'])
			countdownText += `${hours} ${hourWord} `
		}

		if (minutes > 0) {
			const minuteWord = getDeclension(minutes, ['минута', 'минуты', 'минут'])
			countdownText += `${minutes} ${minuteWord}`
		}

		countdownElement.textContent = countdownText.trim()
	}, 1000)
}

async function displayNextBroadcast() {
	const nextBroadcast = await fetchNextBroadcast()
	const nextBroadcastElement = document.getElementById('next-broadcast')

	if (nextBroadcast && !isNaN(nextBroadcast.getTime())) {
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
		const formattedDate = nextBroadcast.toLocaleDateString('ru-RU', options)

		const dayOfWeek = nextBroadcast.toLocaleDateString('ru-RU', {
			weekday: 'long',
		})

		const hours = String(nextBroadcast.getHours()).padStart(2, '0')
		const minutes = String(nextBroadcast.getMinutes()).padStart(2, '0')

		const time = `${hours}:${minutes.replace(/.$/, '0')}`

		let preposition = 'в'
		let adjustedDayOfWeek = dayOfWeek

		if (dayOfWeek === 'вторник') {
			preposition = 'во'
		} else if (dayOfWeek === 'среда') {
			adjustedDayOfWeek = 'среду'
		} else if (dayOfWeek === 'пятница') {
			adjustedDayOfWeek = 'пятницу'
		} else if (dayOfWeek === 'суббота') {
			adjustedDayOfWeek = 'субботу'
		}

		const finalString = `${preposition} ${adjustedDayOfWeek}, ${
			formattedDate.split(', ')[1]
		} в ${time}`

		nextBroadcastElement.textContent = `${finalString}`
	} else {
		nextBroadcastElement.textContent =
			'Не удалось загрузить информацию о следующей трансляции.'
	}
}

async function init() {
	const endTime = await fetchEndTime()
	if (endTime) {
		updateCountdown(endTime)
	}
	await displayNextBroadcast()
}

init()
