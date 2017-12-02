'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import serial from './serial'

const port = (process.env.PORT || 3000)

const exapp = express()
exapp.use(express.static('public'))
exapp.use(bodyParser.json())
exapp.use(bodyParser.urlencoded({
  extended: true
}))

exapp.get('/send/:text', (req, res) => {
  res.send(serial.send(res.params))
})

exapp.get('/receive/', (req, res) => {
  res.send(serial.discovery())
})

exapp.listen(port, '127.0.0.1')