'use strict'

import express from 'express'
import SerialPort from 'serialport'
import http from 'http'
import socketIO from 'socket.io'

const app = express()
const server = http.Server(app)
const io = socketIO(server)
const port = 3000
const serialport = new SerialPort('COM3')

app
	.use(express.static('public'))
	.get('/', (req, res) => {
		res.send('hello world')
	})
	.post('/send/:text', (req, res) => {
		serialport.write(req.params.text, (err) => {
			if (err) res.send('Error on write: ' + err.message)
			else res.send('complete')
		})
	})

server.listen(port, () => {
	io.on('connection', socket => {
		// socket.on('receive', str => {
		// 	io.emit('receive', str)
		// })
	})
	serialport.on('error', err => {
		console.log('Error: ', err.message)
	})
	serialport.on('data', data => {
		console.log('Receive:', data.toString())
		io.emit('receive', data.toString())
	})
	console.log(`URL -> http://localhost:${port}/`)
})