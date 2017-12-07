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