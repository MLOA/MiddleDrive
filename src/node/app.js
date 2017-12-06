'use strict'

import express from 'express'

const app = express()
const port = 3000

app
  .use(express.static('public'))
  .get('/', (req, res) => {
  })
  .post('/send/:text', (req, res) => {
  })
  .listen(port, () => {
    console.log(`URL -> http://localhost:${port}/`)
  })