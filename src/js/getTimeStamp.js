const getTimeStamp = () => {
	const d = new Date()
	const year = d.getFullYear()
	const month = d.getMonth() + 1
	const day = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate()
	const hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours()
	const min = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes()
	const sec = (d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds()
	const msec = ('000' + d.getMilliseconds()).slice(-3)
	return Number(`${year}${month}${day}${hour}${min}${sec}${msec}`)
}

export default getTimeStamp