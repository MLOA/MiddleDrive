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
    console.log(process.cwd())
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database(process.cwd() + '/visualstudio/client/ConsoleApp2/bin/client/middle_drive.db')
    db.serialize(function () {
      db.each('SELECT * FROM text', function (err, row) {
        console.log(row.datetime + ' : ' + row.line)
      })
    })
    db.close()
    res.send('checked')
  })
  .listen(port, () => {
    console.log(`URL -> http://localhost:${port}/`)
  })