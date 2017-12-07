import { setInterval } from "timers"
import getCaretCoordinates from './caretposition'

const Measurement = new function () {
	this.caretPos = function (textarea, mode) {
		var targetElement = textarea;
		if (typeof jQuery != 'undefined') {
			if (textarea instanceof jQuery) {
				targetElement = textarea.get(0);
			}
		}
		// HTML Sanitizer
		var escapeHTML = function (s) {
			var obj = document.createElement('pre');
			obj[typeof obj.textContent != 'undefined' ? 'textContent' : 'innerText'] = s;
			return obj.innerHTML;
		};

		// Get caret character position.
		var getCaretPosition = function (element) {
			var CaretPos = 0;
			var startpos = -1;
			var endpos = -1;
			if (document.selection) {
				// IE Support(not yet)
				var docRange = document.selection.createRange();
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(element);

				var range = textRange.duplicate();
				range.setEndPoint('EndToStart', docRange);
				startpos = range.text.length;

				var range = textRange.duplicate();
				range.setEndPoint('EndToEnd', docRange);
				endpos = range.text.length;
			} else if (element.selectionStart || element.selectionStart == '0') {
				// Firefox support
				startpos = element.selectionStart;
				endpos = element.selectionEnd;
			}
			return { start: startpos, end: endpos };
		};

		// Get element css style.
		var getStyle = function (element) {
			var style = element.currentStyle || document.defaultView.getComputedStyle(element, '');
			return style;
		};

		// Get element absolute position
		var getElementPosition = function (element) {
			// Get scroll amount.
			var html = document.documentElement;
			var body = document.body;
			var scrollLeft = (body.scrollLeft || html.scrollLeft);
			var scrollTop = (body.scrollTop || html.scrollTop);

			// Adjust "IE 2px bugfix" and scroll amount.
			var rect = element.getBoundingClientRect();
			var left = rect.left - html.clientLeft + scrollLeft;
			var top = rect.top - html.clientTop + scrollTop;
			var right = rect.right - html.clientLeft + scrollLeft;
			var bottom = rect.bottom - html.clientTop + scrollTop;
			return {
				left: parseInt(left), top: parseInt(top),
				right: parseInt(right), bottom: parseInt(bottom)
			};
		};

		/***************************\
		* Main function start here! *
		\***************************/

		var undefined;
		var salt = "salt.akiroom.com";
		var textAreaPosition = getElementPosition(targetElement);
		var dummyName = targetElement.id + "_dummy";
		var dummyTextArea = document.getElementById(dummyName);
		if (!dummyTextArea) {
			// Generate dummy textarea.
			dummyTextArea = document.createElement("div");
			dummyTextArea.id = dummyName;
			var textAreaStyle = getStyle(targetElement)
			dummyTextArea.style.cssText = textAreaStyle.cssText;

			// Fix for browser differece.
			var isWordWrap = false;
			if (targetElement.wrap == "off") {
				// chrome, firefox wordwrap=off
				dummyTextArea.style.overflow = "auto";
				dummyTextArea.style.whiteSpace = "pre";
				isWordWrap = false;
			} else if (targetElement.wrap == undefined) {
				if (textAreaStyle.wordWrap == "break-word")
					// safari, wordwrap=on
					isWordWrap = true;
				else
					// safari, wordwrap=off
					isWordWrap = false;
			} else {
				// firefox wordwrap=on
				dummyTextArea.style.overflowY = "auto";
				isWordWrap = true;
			}
			dummyTextArea.style.visibility = 'hidden';
			dummyTextArea.style.position = 'absolute';
			dummyTextArea.style.top = '0px';
			dummyTextArea.style.left = '0px';

			// Firefox Support
			dummyTextArea.style.width = textAreaStyle.width;
			dummyTextArea.style.height = textAreaStyle.height;
			dummyTextArea.style.fontSize = textAreaStyle.fontSize;
			dummyTextArea.style.maxWidth = textAreaStyle.width;
			dummyTextArea.style.backgroundColor = textAreaStyle.backgroundColor;
			dummyTextArea.style.fontFamily = textAreaStyle.fontFamily;
			dummyTextArea.style.padding = textAreaStyle.padding;
			dummyTextArea.style.paddingTop = textAreaStyle.paddingTop;
			dummyTextArea.style.paddingRight = textAreaStyle.paddingRight;
			dummyTextArea.style.paddingBottom = textAreaStyle.paddingBottom;
			dummyTextArea.style.paddingLeft = textAreaStyle.paddingLeft;


			targetElement.parentNode.appendChild(dummyTextArea);
		}

		// Set scroll amount to dummy textarea.
		dummyTextArea.scrollLeft = targetElement.scrollLeft;
		dummyTextArea.scrollTop = targetElement.scrollTop;

		// Set code strings.
		var codeStr = targetElement.value;

		// Get caret character position.
		var selPos = getCaretPosition(targetElement);
		var leftText = codeStr.slice(0, selPos.start);
		var selText = codeStr.slice(selPos.start, selPos.end);
		var rightText = codeStr.slice(selPos.end, codeStr.length);
		if (selText == '') selText = "a";

		// Set keyed text.
		var processText = function (text) {
			// Get array of [Character reference] or [Character] or [NewLine].
			var m = escapeHTML(text).match(/((&amp;|&lt;|&gt;|&#34;|&#39;)|.|\n)/g);
			if (m)
				return m.join('<wbr>').replace(/\n/g, '<br>');
			else
				return '';
		};

		// Set calculation text for in dummy text area.
		dummyTextArea.innerHTML = (processText(leftText) +
			'<wbr><span id="' + dummyName + '_i">' + processText(selText) + '</span><wbr>' +
			processText(rightText));

		// Get caret absolutely pixel position.
		var dummyTextAreaPos = getElementPosition(dummyTextArea);
		var caretPos = getElementPosition(document.getElementById(dummyName + "_i"));
		switch (mode) {
			case 'self':
				// Return absolutely pixel position - (0,0) is most top-left of TEXTAREA.
				return { left: caretPos.left - dummyTextAreaPos.left, top: caretPos.top - dummyTextAreaPos.top };
			case 'body':
			case 'screen':
			case 'stage':
			case 'page':
			default:
				// Return absolutely pixel position - (0,0) is most top-left of PAGE.
				return { left: textAreaPosition.left + caretPos.left - dummyTextAreaPos.left, top: textAreaPosition.top + caretPos.top - dummyTextAreaPos.top };
		}
	};
};

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