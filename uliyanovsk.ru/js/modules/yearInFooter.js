// функция устанавливает год в футере
const yearInFooter = () => {
	const yearInFooter = document.getElementById('year')
	yearInFooter.innerHTML = new Date().getFullYear()
}

export default yearInFooter