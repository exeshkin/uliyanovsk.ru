// функция формирует сокращенную дату для ссылок
const getDateDownloadLink = (obj, key) => {
	const dateArticle = obj[key].date
	const dayData = dateArticle.slice(8, 10)
	const monthDate = dateArticle.slice(5, 7)
	const yearDate = dateArticle.slice(0, 4)

	return `${yearDate.slice(2, 4)}-${monthDate.slice(0, 2)}${dayData.slice(0, 2)}`
}

export default getDateDownloadLink