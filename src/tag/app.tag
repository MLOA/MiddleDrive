app
	header
		h1 MiddleDrive

	.container
		textarea(ref='textarea'
			click='{textareaMouseUpped}'
			keyup='{textareaKeyUpped}')
		.caret(ref='myCaret' device-name='{deviceName}')
			.flag
				span.device-name {deviceName}

	script.
		import api from '../js/api'
		import getCaretCoordinates from '../js/getCaretCoordinates'
		import getTimeStamp from '../js/getTimeStamp'

		this.deviceName = this.opts.deviceName
		this.lastSendTime = 0
		this.lastJson = {}
		this.caret = { start: 0, end: 0 }

		this.on('mount', () => {
			console.log(this.opts)
			this.startCheck()
		})

		textareaMouseUpped(e) {
			this.send()
		}
		textareaKeyUpped(e) {
			this.send()
		}

		moveCarets(textarea, caretElem, pos) {
			this.caret = {
				start: textarea.selectionStart,
				end: textarea.selectionEnd
			}

			const coordinates = getCaretCoordinates(textarea, pos)
			caretElem.style.top =
				textarea.offsetTop
				- textarea.scrollTop
				+ coordinates.top
				- 5
				+ 'px'
			caretElem.style.left =
				textarea.offsetLeft
				- textarea.scrollLeft
				+ coordinates.left
				+ 'px'
		}

		send() {
			const myCaret = document.querySelector('.caret')
			this.moveCarets(this.refs.textarea, myCaret, this.refs.textarea.selectionStart)

			this.lastSendTime = getTimeStamp()

			const makeLatestCaretArray = (prevJson, myDeviceName, myCaretObj) => {
				let caretsArr = []
				if (JSON.stringify(prevJson) !== '{}') {
					caretsArr = prevJson.carets.filter(c => {
						return (c.device !== myDeviceName)
					})
				}
				caretsArr.push({
					'device': myDeviceName,
					'start': myCaretObj.start,
					'end': myCaretObj.end
				})
				return caretsArr
			}
			const getLines = (ele) => {
				return ele.value.split(/\r?\n/g).map((line, i) => {
					return { num: i + 1, text: line }
				})
			}

			const sendObj = {
				'time': this.lastSendTime,
				'device': this.deviceName,
				'carets': makeLatestCaretArray(this.lastJson, this.deviceName, this.caret),
				'lines': getLines(this.refs.textarea)
			}
			return api.send(sendObj)
		}

		startCheck() {
			setInterval(() => {
				api.check().then(json => {
					console.log('check', json)

					if (JSON.stringify(json) === '{}') return

					if (this.lastSendTime < json.time) {
						const update = arr => {
							if (arr !== undefined) {
								const t = arr.map(line => line.text).join('\n')
								this.refs.textarea.value = t
							} else {
								console.log('#update: arr is undefined')
							}
						}
						update(json.lines)
					}
					this.lastJson = json

					const caretElems = document.querySelectorAll('.caret')
					if (json.carets !== undefined) {
						json.carets.forEach(c => {
							let existed = false
							caretElems.forEach(caretElem => {
								const deviceName = caretElem.getAttribute('device-name')
								if (deviceName === c.device) {	// move
									existed = true
									this.moveCarets(this.refs.textarea, caretElem, c.start)
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
								this.moveCarets(this.refs.textarea, newCaret, c.start)
								document.querySelector('.container').appendChild(newCaret)
							}
						})
					}
				})
			}, 400)
		}