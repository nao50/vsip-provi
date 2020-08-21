const { app, BrowserWindow, session } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// app.on('ready', createWindow);
app.on('ready', () => {
  session.defaultSession.resolveProxy(
    'https://www.google.com/',
    (proxyInfo) => {
      console.log('proxyInfo', proxyInfo);
      localStorage.setItem('proxyInfo', proxyInfo);
    }
  );
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
