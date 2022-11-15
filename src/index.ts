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


async function createAuthPrompt(parent: BrowserWindow) {
  const authPromptWin = new BrowserWindow({
    width: 280,
    height: 220,
    modal: true,
    parent,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  authPromptWin.loadFile( path.join(__dirname, "./public/auth-form.html") ); // load your html form

  return new Promise<any>(resolve => {

    ipcMain.once("log-in-attempt", (event, formData: {username: string, password: string}) => {
      
      resolve(formData);
      authPromptWin.destroy();
    })
  })
    
  }



app.whenReady().then(async () => {

  const win = createWindow();
  app.on("login", async (event, webContents, request, authInfo, callback) => {
    event.preventDefault();
    // createAuthPrompt().then((credentials: {username: string, password: string}) => {
      //   console.log(credentials)
      //   callback(credentials.username, credentials.password);
      // });
      const formData = await createAuthPrompt(win);
      console.log( formData);
      callback(formData.username, formData.password);
      // callback("transmission", "Aranciata1!");
  });

  // note: your contextMenu, Tooltip and Title code will go here!

})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

