import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData) => ipcRenderer.send('log-in-attempt', formData),

});

ipcRenderer.on("addFile", (e, data) => {
  const openFileButton = document.getElementById('toolbar-open');
  const fileUploadElement: any = document.getElementById('torrent_upload_file');
  openFileButton!.click();
  const dataTransfer = new DataTransfer()
  const file = new File([data], "torrent.torrent")
  dataTransfer.items.add( file );
  fileUploadElement.files = dataTransfer.files;
  const uploadButton = document.getElementById('upload_confirm_button');
  uploadButton!.click();

})


