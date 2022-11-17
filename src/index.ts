import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createMainWindow } from './components/mainWindow';
import { createAuthModal } from './components/authModal';

let triedAutoLogin = false;

let preferences = {
  ip: "",
  username: "",
  password: ""
}

app.whenReady().then(() => {
  boot();

  // note: your contextMenu, Tooltip and Title code will go here!

});

 
app.on('window-all-closed', () => {
  // app.quit();
});



async function readFile(path: string, encoding?: BufferEncoding | null) {

  try {
    const data = await fs.promises.readFile(path, { encoding })
    return data;
  }
  catch (err) {
    console.error(err)
    return null;
  }
}

function createLoginEventListener(parentWindow: BrowserWindow) {
  app.on("login", async (event, webContents, request, authInfo, callback) => {
      console.log("login attempt");
      event.preventDefault();
        if(!triedAutoLogin) {
          console.log("Auto login")
          callback(preferences.username, preferences.password);
          triedAutoLogin = true;
        } else {
          console.log("Failed Auto login")
          const formData = await createAuthModal(parentWindow);
          callback(formData.username, formData.password);
        }
        // loadCSS(parentWindow);
  });
}

function loadCSS(win: BrowserWindow) {
  fs.readFile(path.join(__dirname, 'public/mainStyle.css'), "utf8",(err, data) => {
    if (err) {
      console.error(err);
    } else {
      win.webContents.send("getCSS", data);
    }
  });
}

async function boot() {
  
  const win = createMainWindow();
  createLoginEventListener(win);
  try {
    const file = await readFile(`${app.getPath("userData")}/preferences.json`, 'utf8');
    // const ses = win.webContents.session;

    if (typeof file === "string") {
      preferences = JSON.parse(file);
    }
    await win.loadURL(`http://${preferences.ip}:9091/transmission/web/`);
  } catch(err) {

    console.error(err);
    const formData = await createAuthModal(win);
    console.log(triedAutoLogin)
    preferences = formData;

    win.close();
    boot();

    
  }

  app.on("open-file", async (event: any, path: string) => {
    event.preventDefault();
    const file = await readFile(path);
    win.webContents.send("addFile", file)
  });
  ipcMain.on("log-in-button-clicked", () => {
    // const formData = createAuthModal(win);
    // ses.closeAllConnections();
    win.close();
    boot();

    // app.relaunch();
  });
}