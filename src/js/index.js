import getCaretCoordinates from './caretposition'
import getTimeStamp from './getTimeStamp'
import app from '../tag/app'
import riot from 'riot'

riot.mount('main', 'app')

let deviceName = 'unknown'
let lastSendTime = 0
let lastJson = {}
const caret = { start: 0, end: 0 }

const textarea = document.querySelector('.textarea')

const getDeviceName = () => {
	const url = '/getdevicename'
	return fetch(url).then(res => {
		return res.text()
	}).then(res => {
		deviceName = res
		const setDeviceNameToMyCaret = () => {
			const myCaret = document.querySelector('.caret')
			myCaret.setAttribute('device-name', deviceName)
			myCaret.querySelector('.device-name').textContent = deviceName
		}
		setDeviceNameToMyCaret()
		console.log('device', res)
	})
}
getDeviceName()

const moveCarets = (ele, pos) => {
	caret.start = textarea.selectionStart
	caret.end = textarea.selectionEnd
	const coordinates = getCaretCoordinates(textarea, pos)
	ele.style.top =
		textarea.offsetTop
		- textarea.scrollTop
		+ coordinates.top
		- 5
		+ 'px';
	ele.style.left =
		textarea.offsetLeft
		- textarea.scrollLeft
		+ coordinates.left
		+ 'px'
}

const send = () => {
	const caretElem = document.querySelector('.caret')
	moveCarets(caretElem, textarea.selectionStart)

	let caretsArr = []

	if (JSON.stringify(lastJson) !== '{}') {
		caretsArr = lastJson.carets.filter(c => {
			return (c.device !== deviceName)
		})
	}
	caretsArr.push({
		'device': deviceName,
		'start': caret.start,
		'end': caret.end
	})

	lastSendTime = getTimeStamp()
	const sendObj = {
		'time': lastSendTime,
		'carets': caretsArr,
		'lines': textarea.value.split(/\r?\n/g).map((line, i) => {
			return {
				num: i + 1,
				text: line
			}
		}),
		'device': deviceName
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
	if (arr !== undefined) {
		const t = arr.map(line => line.text).join('\n')
		textarea.value = t
	} else {
		console.log('#update: arr is undefined')
	}
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

textarea.addEventListener('click', e => {
	send()
})
textarea.addEventListener('keyup', e => {
	send()
})

setInterval(() => {
	check().then(json => {
		console.log(json)

		if (JSON.stringify(json) === '{}') return

		if (json.lines !== undefined) {
			// console.log(json.device, json.lines.map(line => line.text).join('\n'))
		}
		if (lastSendTime < json.time) {
			update(json.lines)
		}
		lastJson = json

		const carets = document.querySelectorAll('.caret')
		if (json.carets !== undefined) {
			json.carets.forEach(c => {
				let existed = false
				carets.forEach(caretElem => {
					const deviceName = caretElem.getAttribute('device-name')
					if (deviceName === c.device) {	// move
						existed = true
						moveCarets(caretElem, c.start)
					}
				})
				if (!existed) {	// add
					const newDevice = document.createElement('span')
					newDevice.classList.add('device-name')
					newDevice.textContent = c.device
					const newFlag = document.createElement('div')
					newFlag.classList.add('flag')
					newFlag.appendChild(newDevice)
					const newCaret = document.createElement('div')
					newCaret.classList.add('caret')
					newCaret.setAttribute('device-name', c.device)
					newCaret.appendChild(newFlag)
					moveCarets(newCaret, c.start)
					document.querySelector('.container').appendChild(newCaret)
				}
			})
		}
	})
}, 400)