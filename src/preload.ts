import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData) => ipcRenderer.send('log-in-attempt', formData)
});

