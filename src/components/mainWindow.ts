import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export const createMainWindow = () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      minHeight: 200,
      minWidth: 600,
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

    win.on("ready-to-show", () => {
        
        loadCSS(win);
        
            
    });
    win.on("close", () => {
        win.destroy();
        app.removeAllListeners("login");
        app.removeAllListeners("open-file");
        app.removeAllListeners("log-in-button-clicked");
        app.removeAllListeners("window-all-closed");
        ipcMain.removeAllListeners("log-in-button-clicked");
    });
    return win 
};

function loadCSS(win: BrowserWindow) {
    fs.readFile(path.join(__dirname, '../public/mainStyle.css'), "utf8",(err, data) => {
      if (err) {
        console.error(err);
      } else {
        win.webContents.send("getCSS", data);
      }
    });
}