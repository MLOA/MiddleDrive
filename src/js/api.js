export default class API {
	static check() {
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
	static getDeviceName() {
		const url = '/getdevicename/'
		return fetch(url).then(res => {
			return res.text()
		})
	}
	static send(sendObj) {
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
}