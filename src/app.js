'use strct'

import electron from 'electron'
import express from 'express'
import bodyParser from 'body-parser'
import btc from './btCommands'

const port = (process.env.PORT || 3000)

const exapp = express()
exapp.use(express.static('public'))
exapp.use(bodyParser.json())
exapp.use(bodyParser.urlencoded({
  extended: true
}))

exapp.get('/info/', function(req, res) {
  res.send(btc.info());
});

exapp.get('/discovery/', function(req, res) {
  res.send(btc.discovery());
});

exapp.listen(port, '127.0.0.1')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow = null

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

// Electronの初期化完了後に実行
app.on('ready', () => {
  //ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  mainWindow = new BrowserWindow({width: 600, height: 400, useContentSize: true})

  //mainWindow.webContents.openDevTools()
  mainWindow.loadURL('http://127.0.0.1:' + port + '/discovery')

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})