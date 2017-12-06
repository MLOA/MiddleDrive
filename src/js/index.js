import { setInterval } from "timers";

console.log('index')

const textarea = document.querySelector('textarea')

const send = text => {
	const url = '/send/' + text
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		console.log('result: ' + t)
		update(t)
	})
}

const update = str => {
	textarea.value = str
}

const check = () => {
	const url = '/check/'
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.json()
	}).then(data => {
		console.log('result', data)
	})
}

textarea.addEventListener('keyup', e => {
	const text = textarea.value
	// console.log('send: ', text)
	send(text)
})

setInterval(() => {
	check()
}, 5000)