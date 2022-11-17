import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

export const createMainWindow = () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      title: "Transmission",
      frame: false,
      titleBarStyle: "hidden",
  
      webPreferences: {
        // nodeIntegration: false,
        // contextIsolation: true,
        preload: path.join(__dirname, 'mainWindowPreload.js')
      }
    });
  
    win.on('page-title-updated', function(e) {
      e.preventDefault()
    });
    // app.on("login", async (event, webContents, request, authInfo, callback) => {
    //     console.log("ogin")
    // })
    return win 
};