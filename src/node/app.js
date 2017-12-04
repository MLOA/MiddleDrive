'use strict'

import express from 'express'
import SerialPort from 'serialport'

const app = express()
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
      else res.send('message written')
    })
  })
  .listen(port, () => {
    serialport.on('error', err => {
      console.log('Error: ', err.message)
    })

    serialport.on('data', function (data) {
      console.log('Data:', data.toString())
    })

    serialport.write('init', err => {
      if (err) console.log('Error on write: ' + err.message)
      else console.log('message written')
    })

    console.log(`URL -> http://localhost:${port}/`)
  })