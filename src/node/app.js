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
	.get('/check/', (req, res) => {
		// console.log(process.cwd())
		const sqlite3 = require('sqlite3').verbose()
		const db = new sqlite3.Database('//rt-ac3200-b250/sda1/client/middle_drive.db')
		db.serialize(() => {
			db.all('SELECT * FROM text WHERE id = (select max(id) from text)', (err, rows) => {
				const rowsObj = rows.map(row => {
					return {
						time: row.datetime,
						text: decodeURIComponent(row.line)
					}
				})
				res.send(rowsObj[0])
			})
		})
		db.close()
	})
	.listen(port, () => {
		console.log(`URL -> http://localhost:${port}/`)
	})