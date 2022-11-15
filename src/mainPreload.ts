import { contextBridge, ipcRenderer } from 'electron';
// import * as fs from 'fs';







contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData) => ipcRenderer.send('log-in-attempt', formData),
    // addFile: (file) => ipcRenderer.once('addFile', file) 
});

ipcRenderer.on("addFile", (e, data) => {
  const openFileButton = document.getElementById('toolbar-open');
  const fileUploadElement: any = document.getElementById('torrent_upload_file');
  openFileButton!.click();
  const dataTransfer = new DataTransfer()
  const file = new File([data], "test.torrent")
  dataTransfer.items.add( file );
  fileUploadElement.files = dataTransfer.files;
  const uploadButton = document.getElementById('upload_confirm_button');
  uploadButton!.click();

})

function test() {
    // console.log("testLoaded")
    // const fileUpload: any = document.getElementById('torrent_upload_file');
    const path = "/Volumes/Garrett/garrett/Downloads/Rick.and.Morty.S06E05.720p.HEVC.x265-MeGusta [IPT].torrent"

    console.log(window)
    // fs.readFile(path, (err, file) => {
    //     if (err) {
    //       console.error(err)
    //     } else {
    //       console.log(file)
         
    //     }
    //   })
    // const fileList: FileList = [file]
    // fileUpload.value = filename;
   
}
