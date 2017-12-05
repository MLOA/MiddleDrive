console.log('index')

const send = text => {
	const url = 'http://localhost:3000/send/' + text
	return fetch(url, {
		method: 'POST',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		console.log('result: ' + t)
	})
}

const submitButton = document.querySelector('.submit')
submitButton.addEventListener('click', e => {
	const text = document.querySelector('textarea').value
	console.log('send: ', text)
	send(text)
})