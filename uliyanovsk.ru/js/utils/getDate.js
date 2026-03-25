// функция формирует дату
const getDate = (obj, key) => {
	const dateArticle = obj[key].date
	const dayData = dateArticle.slice(8, 10)
	const monthDate = dateArticle.slice(5, 7)
	const yearDate = dateArticle.slice(0, 4)

	return `${dayData}-${monthDate}-${yearDate}`
}

export default getDate