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
    const db = new sqlite3.Database(process.cwd() + '/visualstudio/client/ConsoleApp2/bin/Debug/middle_drive.db')
    db.serialize(() => {
      const sql = 'SELECT * FROM text WHERE id = (select max(id) from text)'
      db.all(sql, (err, rows) => {
        const rowsObj = rows.map(row => {
          const textObj = decodeURIComponent(row.text).split(/\r?\n/g)
            .map((text, i) => {
              return {
                'line': i + 1,
                'text': text
              }
            })

          return {
            'time': '20171208120000',
            'cursors': [
              {
                'line': 1,
                'column': 3
              }
            ],
            'lines': textObj,
            'device': 'MLOA-PC'
          }
        })
        res.send(rowsObj[0])
      })
    })
    db.close()
  })
  .listen(port, () => {
    console.log(`URL -> http://localhost:${port}/`)
  })