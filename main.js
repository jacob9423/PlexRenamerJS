const { app, BrowserWindow } = require('electron');
const Data = require('./data.js');

let mainWindow;

function createWindow () {
   mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html');
}


app.whenReady().then(createWindow);

