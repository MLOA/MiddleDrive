import { setInterval } from "timers"

console.log('index')

const textarea = document.querySelector('textarea')

const send = text => {
	const textObj = text.split(/\r?\n/g).map((line, i) => {
		return {
			num: i + 1,
			text: line
		}
	})

	const sendObj = {
		'time': '20171208120000',
		'cursors': [
			{
				'line': 1,
				'column': 3
			}
		],
		'lines': textObj,
		'device': 'MLOA-PC'
	}

	const url = '/send/' + JSON.stringify(sendObj)
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
	// textarea.value = str
}

const check = () => {
	const url = '/check/'
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(data => {
		// update(t)
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
}, 500)

const checkButton = document.querySelector('.check')
checkButton.addEventListener('click', e => {
	check()
})