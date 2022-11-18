import { app, BrowserWindow, ipcMain, safeStorage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createMainWindow } from './components/mainWindow';
import { createAuthModal, store } from './components/authModal';



let triedAutoLogin = false;

let preferences = {
  url: undefined,
  username: undefined,
  password: undefined
}

app.whenReady().then(() => {
  boot();
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
  });
}

async function loginOnBoot(win: BrowserWindow) {
  try {

    preferences.url = store.get("url");
    preferences.username = store.get("username");
    preferences.password = safeStorage.decryptString(Buffer.from(store.get("password"), 'latin1'));

    // const timeout = setTimeout(() => {
    //   win.loadFile( path.join(__dirname, "./public/error.html") )
    // }, 5000)
    await win.loadURL(`${preferences.url}/transmission/web/`);
    // clearTimeout(timeout);

  } catch(err) {

    console.error(err);
    const formData = await createAuthModal(win);

    preferences = formData;

    setTimeout(() => {
      win.close();
    },100)
    boot();  
  }
}

async function boot() {
  
  const win = createMainWindow();
  createLoginEventListener(win);

  await loginOnBoot(win);

  app.on("open-file", async (event: any, path: string) => {
    event.preventDefault();
    const file = await readFile(path);
    win.webContents.send("addFile", file)
  });

  ipcMain.on("log-in-button-clicked", async () => {
    try {
      const formData = await createAuthModal(win);
      preferences = formData;
      triedAutoLogin = false;
      setTimeout(() => {
        win.close();
      },100)
      boot();
    } catch (err) {
      console.error(err)
    }
  });
  app.on('window-all-closed', () => {
    // setTimeout(() => {
      app.quit();
    // },1000)
  });
}