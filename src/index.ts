import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createMainWindow } from './components/mainWindow';

let triedAutoLogin = false;

async function createAuthPrompt(parent: BrowserWindow) {
  const authPromptWin = new BrowserWindow({
    width: 400,
    height: 280,
    modal: true,
    backgroundColor: "#00000000",
    transparent: true,
    roundedCorners: false,
    frame: false,

    parent,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      preload: path.join(__dirname, 'loginPreload.js')
    }
  });
  authPromptWin.loadFile( path.join(__dirname, "./public/auth-form.html") ); // load your html form
  authPromptWin.once("blur", () => {
    authPromptWin.close();
  })
  authPromptWin.once("close", () => {
    authPromptWin.destroy();
  })

  return new Promise<any>(resolve => {

      ipcMain.once("log-in-attempt", (event, formData: {username: string, password: string}) => {
        
        resolve(formData);
        
        fs.writeFileSync(`${app.getPath("userData")}/preferences.json`, JSON.stringify(formData))
        authPromptWin.destroy();
      })
    })
    
  }


let preferences: {
  ip: string,
  username: string,
  password: string
}
app.whenReady().then(async () => {
  const win = createMainWindow();
  fs.readFile(`${app.getPath("userData")}/preferences.json`, 'utf8', async (err, data) => {
    if (err) {
      const formData = await createAuthPrompt(win);
      const didLoad = await win.loadURL(`http://${formData.ip}:9091/transmission/web/`);
      
    } else {
      preferences = JSON.parse(data);
      try {
        const didLoad = await win.loadURL(`http://${preferences.ip}:9091/transmission/web/`);
      } catch(err) {
        console.log(err)
      }
    }
  });
  win.on("ready-to-show", () => {
    fs.readFile(path.join(__dirname, 'public/mainStyle.css'), "utf8",(err, data) => {
      if (err) {
        console.error(err);
      } else {
        // console.log("data", data);
        win.webContents.send("getCSS", data);
      }
    })
  })


  app.on("login", async (event, webContents, request, authInfo, callback) => {
      
      event.preventDefault();

      fs.readFile(`${app.getPath("userData")}/preferences.json`, 'utf8', async (err, data) => {
        // console.log(app.getPath("userData"), data)
        if (err || triedAutoLogin) {
          console.error(err)
          const formData = await createAuthPrompt(win);
   
          callback(formData.username, formData.password);
        } else {
          
          preferences = JSON.parse(data);
          callback(preferences.username, preferences.password);
          triedAutoLogin = true
        }
      })

      

  });

  app.on("open-file", (event: any, path) => {
    event.preventDefault()

    fs.readFile(path, (err, file) => {
      if (err) {
        console.error(err)
      } else {
        win.webContents.send("addFile", file)
      }
    })
  })

  ipcMain.on("log-in-button-clicked", () => {
    const formData = createAuthPrompt(win);
    console.log("login")
  })

  // note: your contextMenu, Tooltip and Title code will go here!

})


app.on('window-all-closed', () => {
  app.quit();
});


