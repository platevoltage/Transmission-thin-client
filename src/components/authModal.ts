import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export async function createAuthModal(parent: BrowserWindow) {
  const authPromptWin = new BrowserWindow({
    width: 400,
    height: 280,
    modal: true,
    backgroundColor: "#00000000",
    transparent: true,
    roundedCorners: false,
    frame: false,
    alwaysOnTop: true,

    parent,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      preload: path.join(__dirname, 'authModalPreload.js')
    }
    });
    authPromptWin.loadFile( path.join(__dirname, "../public/auth-form.html") ); // load your html form
    authPromptWin.once("blur", () => {
      authPromptWin.close();
    })
    authPromptWin.once("close", () => {
      authPromptWin.destroy();
    })
  
    return new Promise<any>(resolve => {
        ipcMain.once("log-in-attempt", (event, formData: object) => {
          
          resolve(formData);
          
          fs.writeFileSync(`${app.getPath("userData")}/preferences.json`, JSON.stringify(formData))
          authPromptWin.destroy();
        })
    })
    
  }