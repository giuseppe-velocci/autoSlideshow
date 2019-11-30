// const tensorImg = require('./src/tensor-img');
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

function createWindow () {
  // Crea la finestra del browser
  let win = new BrowserWindow({
    width: 1024,
    height: 640,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // e carica l'index.html dell'app.
  win.loadFile('index.html')
}

// drag-drop files
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png'
  })
})

app.on('ready', createWindow)