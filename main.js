const { app, BrowserWindow} = require('electron');

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





