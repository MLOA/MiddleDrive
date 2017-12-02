console.log('hello')

const send = text => {
	const url = 'http://localhost:3000/send/' + text
	return fetch(url, {
		method: 'POST',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		console.log('data' + t)
	})
}

const submitButton = document.querySelector('.submit')
submitButton.addEventListener('click', e => {
	send(document.querySelector('textarea').value)
})