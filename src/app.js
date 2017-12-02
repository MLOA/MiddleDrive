'use strict'

import express from 'express'
import SerialPort from 'serialport'

var app = express()
var port = new SerialPort('COM3')

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/send/:text', function (req, res) {
  port.write(req.params.text, (err) => {
    if (err) console.log('Error on write: ' + err.message)
    else console.log('message written')
  })
  res.send('wei')
})

app.listen(3000, function () {
  port.on('error', function (err) {
    console.log('Error: ', err.message)
  })

  port.on('data', function (data) {
    console.log('Data:', data.toString())
  })

  port.write('init', (err) => {
    if (err) console.log('Error on write: ' + err.message)
    else console.log('message written')
  })

  console.log('Example app listening on port 3000!')
})