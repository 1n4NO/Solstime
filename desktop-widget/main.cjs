const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

const widgetUrl = process.env.SOLSTIME_WIDGET_URL || 'http://localhost:3000';

function createWindow() {
  const window = new BrowserWindow({
    width: 560,
    height: 640,
    minWidth: 420,
    minHeight: 500,
    backgroundColor: '#111513',
    title: 'Solstime',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
  void window.loadURL(widgetUrl);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
