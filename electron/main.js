const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(__dirname, '../assets/logo.jpeg')
  });

  win.loadFile(path.join(__dirname, '../index.html'));
}

app.whenReady().then(createWindow);