const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: 'assets/logo.jpeg'
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);