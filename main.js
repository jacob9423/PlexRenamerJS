const { app, BrowserWindow} = require('electron');
require('@electron/remote/main').initialize()

let mainWindow;

function createWindow () {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true
      
    }
  })
  mainWindow.removeMenu();
  mainWindow.loadFile('./src/html/index.html');
}

app.on('browser-window-created', (_, window) => {
  require("@electron/remote/main").enable(window.webContents)
})

app.whenReady().then(createWindow);





