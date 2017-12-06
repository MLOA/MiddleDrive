console.log('index')

const send = text => {
	const url = '/send/' + text
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		console.log('result: ' + t)
	})
}

const check = () => {
	const url = '/check/'
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(res => {
		return res.text()
	}).then(t => {
		console.log('result: ' + t)
	})
}

const update = str => {

}

const submitButton = document.querySelector('.submit')
submitButton.addEventListener('click', e => {
	const text = document.querySelector('textarea').value
	console.log('send: ', text)
	send(text)
})