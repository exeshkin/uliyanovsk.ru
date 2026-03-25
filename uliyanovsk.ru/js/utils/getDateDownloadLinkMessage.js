// функция формирует сокращенную дату для ссылок
const getDateDownloadLink = (id) => {
	const dayData = id.slice(8, 10)
	const monthDate = id.slice(5, 7)
	const yearDate = id.slice(0, 4)

	return `${yearDate.slice(2, 4)}-${monthDate.slice(0, 2)}${dayData.slice(0, 2)}`
}

export default getDateDownloadLink