import { setInterval } from "timers"

console.log('index')

const textarea = document.querySelector('textarea')

const send = text => {
	lastSendTime = getTimeStamp()
	const sendObj = {
		'time': lastSendTime,
		'cursors': [
			{
				'line': 1,
				'column': 3
			}
		],
		'lines': text.split(/\r?\n/g).map((line, i) => {
			return {
				num: i + 1,
				text: line
			}
		}),
		'device': 'MLOA-PC'
	}
	const url = '/send/'
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sendObj),
		mode: 'cors'
	}).then(res => {
		return res.text()
	})
}

const update = arr => {
	const t = arr.map(line => line.text).join('\n')
	textarea.value = t
}

const check = () => {
	const url = '/check/'
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(data => {
		const decodedText = decodeURI(data)
		const json = JSON.parse(decodedText)
		return json
	})
}

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

let lastSendTime = 0

textarea.addEventListener('keyup', e => {
	const text = textarea.value
	send(text).then(res => {

	})
})

setInterval(() => {
	check().then(json => {
		console.log(json.lines.map(line => line.text).join('\n'))
		if (lastSendTime < json.time) {
			update(json.lines)
		}
	})
}, 400)

const checkButton = document.querySelector('.check')
checkButton.addEventListener('click', e => {
	check()
})