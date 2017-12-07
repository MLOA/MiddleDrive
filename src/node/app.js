'use strict'

import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app
  .use(express.static('public'))
  .use(bodyParser.urlencoded({
    // extended: true
  }))
  .use(bodyParser.json())
  .get('/', (req, res) => {
  })
  .post('/send/', (req, res) => {
    const url = 'http://localhost:8000/'
    // console.log(req.body)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(req.body),
      mode: 'cors',
    }).then(result => {
      return result.text()
    }).then(text => {
      res.send(text)
    })
  })
  .get('/check/', (req, res) => {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database(process.cwd() + '/visualstudio/server/ConsoleApp3/bin/Debug/middle_drive.db')
    db.serialize(() => {
      const sql = 'SELECT * FROM text WHERE id = (select max(id) from text)'
      db.all(sql, (err, rows) => {
        res.send(rows[0].line)
      })
    })
    db.close()
  })
  .listen(port, () => {
    console.log(`URL -> http://localhost:${port}/`)
  })