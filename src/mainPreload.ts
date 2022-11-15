import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData) => ipcRenderer.send('log-in-attempt', formData),

});


document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('drop', (e: DragEvent) => {
  const fileList = e.dataTransfer?.files
  uploadTorrent(fileList);
});

ipcRenderer.on("addFile", (e, data) => {
  const dataTransfer = new DataTransfer()
  const file = new File([data], "torrent.torrent")
  dataTransfer.items.add( file );
  uploadTorrent(dataTransfer.files);

})

function uploadTorrent(fileList) {
  const openFileButton = document.getElementById('toolbar-open');
  const fileUploadElement: any = document.getElementById('torrent_upload_file');
  openFileButton!.click();

  fileUploadElement.files = fileList;
  const uploadButton = document.getElementById('upload_confirm_button');
  uploadButton!.click();
}


