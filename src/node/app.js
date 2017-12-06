'use strict'

import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = 3000

app
	.use(express.static('public'))
	.get('/', (req, res) => {
	})
	.get('/send/:text', (req, res) => {
		const url = 'http://localhost:8000/' + req.params.text
		return fetch(url, {
			method: 'GET',
			mode: 'cors'
		}).then(result => {
			return result.text()
		}).then(text => {
			res.send(text)
		})
	})
	.listen(port, () => {
		console.log(`URL -> http://localhost:${port}/`)
	})