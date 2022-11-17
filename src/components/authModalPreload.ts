import { contextBridge, ipcRenderer } from 'electron';






contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData: object) => ipcRenderer.send('log-in-attempt', formData),

    
});



