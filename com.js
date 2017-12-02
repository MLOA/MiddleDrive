var SerialPort = require('serialport');
var port = new SerialPort('COM3');

// port.write(' im salmooooooo\nooooooooon !!', function (err) {
// 	if (err) {
// 		return console.log('Error on write: ', err.message);
// 	}
// 	console.log('message written');
// });

// Open errors will be emitted as an error event
port.on('error', function (err) {
	console.log('Error: ', err.message);
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
	console.log('Data:', data.toString());
	// console.log('Data:', data);
});