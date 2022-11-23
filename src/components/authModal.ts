import { app, BrowserWindow, ipcMain, safeStorage } from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';

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

  interface FormData {
    url: string;
    username: string;
    password: string;
  }

  return new Promise<any>(resolve => {
    ipcMain.once("log-in-attempt", (event, formData: FormData) => {
      
      resolve(formData);

      store.set("url",formData.url)
      store.set("username",formData.username)
      const buffer = safeStorage.encryptString(formData.password);
      store.set("password", buffer.toString('latin1'));

      authPromptWin.destroy();
    })
  })
    
}

export const store = new Store<Record<string, string>>({
  name: 'login',
  watch: true,
  encryptionKey: 'this_only_obfuscates',
});