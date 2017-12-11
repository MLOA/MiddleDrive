const SerialPort = require('serialport')
const port = new SerialPort('COM3')

port.write('send.js', function (err) {
	if (err) {
		return console.log('Error on write: ', err.message)
	}
})

port.on('error', err => {
	console.log('Error: ', err.message)
})