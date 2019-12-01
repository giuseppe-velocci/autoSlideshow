// const tensorImg = require('./src/tensor-img');
const { app, BrowserWindow } = require('electron')
const { dialog } = require('electron')

function createWindow () {
  // Crea la finestra del browser
  let win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // e carica l'index.html dell'app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)