const SerialPort = require('serialport')
const port = new SerialPort('COM3')

port.on('error', err => {
	console.log('Error: ', err.message)
})

port.on('data', function (data) {
	console.log('receive:', data.toString())
})