// функция формирует дату из id
const getDateFromId = id => {
	const dayData = id.slice(8, 10)
	const monthDate = id.slice(5, 7)
	const yearDate = id.slice(0, 4)

	return `${dayData}-${monthDate}-${yearDate}`
}

const getYearsLinkFromId = id => {
	if (id.slice(0, 4) >= 1947 && id.slice(0, 4) <= 1957) {
		return 'message-years-1947-1957.html'
	}
	if (id.slice(0, 4) >= 1958 && id.slice(0, 4) <= 1962) {
		return 'message-years-1958-1962.html'
	}
	if (id.slice(0, 4) >= 1963 && id.slice(0, 4) <= 1965) {
		return 'message-years-1963-1965.html'
	}
}

export {getDateFromId, getYearsLinkFromId}
