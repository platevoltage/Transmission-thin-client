import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let triedAutoLogin = false;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Transmission",

    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      preload: path.join(__dirname, 'mainPreload.js')
    }
  });

  win.loadURL('http://10.0.0.3:9091/transmission/web/');



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
      
      fs.writeFileSync(`${app.getPath("userData")}/preferences.json`, JSON.stringify(formData))
      authPromptWin.destroy();
    })
  })
    
  }



app.whenReady().then(async () => {

  const win = createWindow();

  app.on("login", async (event, webContents, request, authInfo, callback) => {
      event.preventDefault();

      fs.readFile(`${app.getPath("userData")}/preferences.json`, 'utf8', async (err, data) => {
        
        if (err || triedAutoLogin) {
          console.error(err)
          const formData = await createAuthPrompt(win);
   
          callback(formData.username, formData.password);
        } else {
          const preferences = JSON.parse(data);
          console.log(preferences)
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

  // note: your contextMenu, Tooltip and Title code will go here!

})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

