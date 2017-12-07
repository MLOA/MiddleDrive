'use strict'

import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import os from 'os'

const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose()
const dbPath = process.cwd() + '/middle_drive.db'

app
  .use(express.static('public'))
  .use(bodyParser.urlencoded({
    // extended: true
  }))
  .use(bodyParser.json())
  .get('/getdevicename', (req, res) => {
    res.send(os.hostname())
  })
  .post('/send/', (req, res) => {
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
      db.run('INSERT INTO text(line, datetime) VALUES (?, ?)',
        [JSON.stringify(req.body), req.body.time],
        err => {
          if (err !== null) console.log(err)
          const url = 'http://localhost:8000/'

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
    })
    db.close()
  })
  .get('/check/', (req, res) => {
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
      const sql = 'SELECT * FROM text WHERE datetime = (select max(datetime) from text)'
      db.all(sql, (err, rows) => {
        if (err !== null) console.log(err)
        else {
          if (rows.length === 0) res.send('{}')
          else res.send(rows[0].line)
        }
      })
    })
    db.close()
  })
  .listen(port, () => {
    console.log(`URL -> http://localhost:${port}/`)
  })