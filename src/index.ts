import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Transmission",
    // fullscreen: true,
    // kiosk: true,
    // visualEffectState: "active",
    // vibrancy: 'sidebar',
    // resizable: false,
    // maximizable: false,
    // movable: false,
    // titleBarStyle: "hidden",
    // useContentSize: true,
    // frame: false,
    // show: false,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      // preload: path.join(__dirname, 'extensionScript.js')
    }
  });

  win.loadURL('http://10.0.0.3:9091/transmission/web/');
  // win.loadFile('./index.html')


  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });
  return win
      
};

app.on("login", (event, webContents, request, authInfo, callback) => {
  event.preventDefault();
  callback("transmission", "");
  // createAuthPrompt().then(credentials => {
  //   callback("transmission", "Aranciata1!");
  // });
});

function createAuthPrompt() {
  const authPromptWin = new BrowserWindow();
  authPromptWin.loadFile("auth-form.html"); // load your html form

  return new Promise((resolve, reject) => {
    ipcMain.once("form-submission", (event, username, password) => {
      authPromptWin.close();
      const credentials = {
        username,
        password
      };
      resolve(credentials);
    });
  });
}

app.whenReady().then(async () => {

  const win = createWindow();
  win.webContents.executeJavaScript('console.log("test")')
  // note: your contextMenu, Tooltip and Title code will go here!
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

