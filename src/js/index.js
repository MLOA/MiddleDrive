console.log('index')

let lastModifiedTime = 0

const socket = io()
socket.on('receive', str => {
	const obj = JSON.parse(str)
	if (Number(obj.time) > Number(lastModifiedTime)) {
		document.querySelector('textarea')
			.textContent = obj.text
		lastModifiedTime = Number(obj.time)
	}
})

const send = text => {
	const url = 'http://localhost:3000/send/' + text
	return fetch(url, {
		method: 'POST',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		if (!t === 'complete') console.log('result: ' + t)
	})
}
const getTimeStamp = () => {
	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
	const hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
	const min = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();
	const sec = (d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds();
	return Number(`${year}${month}${day}${hour}${min}${sec}`)
}

const submitButton = document.querySelector('.submit')
submitButton.addEventListener('click', e => {
	const sendObj = {
		time: getTimeStamp(),
		text: document.querySelector('textarea').value
	}
	console.log('send: ', sendObj)
	send(JSON.stringify(sendObj))
})