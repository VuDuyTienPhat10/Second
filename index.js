const { app, BrowserWindow, ipcMain } = require('electron');

function createwindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
    win.webContents.openDevTools()
}
ipcMain.on('da an het', (event, data) => {
    console.log('du lieu lay duoc tu frontend game.js ne:', data)
})


app.on('ready', createwindow)