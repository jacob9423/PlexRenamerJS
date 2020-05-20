const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const Data = require('./src/js/data.js');

let test;
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
  mainWindow.loadFile('./src/html/index.html');
}
app.whenReady().then(createWindow);

ipcMain.on('fromEpiDone', function(event, arg) {
  let returnToIndex = arg;
  mainWindow
  ipcMain.on('requestFromIndexForStartEp', function(event, arg) {
      event.sender.send('responceToIndexForStartep', returnToIndex);
  });
});



