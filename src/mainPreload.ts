import { contextBridge, ipcRenderer } from 'electron';


setTimeout(() => {
  const head = document.querySelector('head');
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css')
  head!.appendChild(link);


  const body = document.querySelector('body');
  const style = document.createElement('style');
  style.textContent = `
  * {
    border-color: #777777 !important;

  }
  .torrent {
    background-color: #333333 !important;
    border-color: #777777 !important;
  }
  .torrent.selected{
    background-color: #555555 !important;
  }
  .torrent_name {
    color: #ffffff !important;
  }
  #toolbar {
    background-color: #333333 !important;
    font-size: 30px !important;
    color: #eeeeee !important;
    background-image: none !important;
  }
  #toolbar div {
    margin: 0 !important;
    background-image: none !important;
  }
  #statusbar, .torrent_footer {
    background-color: #333333 !important;
    color: #eeeeee !important;
    background-image: none !important;
  }
  [class^="bi-"]::before, [class*=" bi-"]::before {
    vertical-align: text-center !important;
    
  }`
  body!.appendChild(style);


  function swapIconWithBootstrap(elementName: string, className: string) {
    const element = document.getElementById(elementName);
    const icon = document.createElement('i');
    icon.setAttribute("class", className)
    element?.appendChild(icon);
  }
  swapIconWithBootstrap("toolbar-open", "bi bi-folder2-open");
  swapIconWithBootstrap("toolbar-remove", "bi bi-x-circle");
  swapIconWithBootstrap("toolbar-start", "bi bi-play-circle");
  swapIconWithBootstrap("toolbar-pause", "bi bi-pause-circle");
  swapIconWithBootstrap("toolbar-start-all", "bi bi-play-circle-fill");
  swapIconWithBootstrap("toolbar-pause-all", "bi bi-pause-circle-fill");
  swapIconWithBootstrap("toolbar-inspector", "bi bi-info-circle");
},100)


contextBridge.exposeInMainWorld("api", {
    sendFormData: (formData) => ipcRenderer.send('log-in-attempt', formData),
});


document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('drop', (e: DragEvent) => {
  if (e.dataTransfer) {
    const fileList: FileList = e.dataTransfer.files
    uploadTorrent(fileList);
  }
});

ipcRenderer.on("addFile", (e, data) => {
  const dataTransfer = new DataTransfer()
  const file = new File([data], "torrent.torrent")
  dataTransfer.items.add( file );
  uploadTorrent(dataTransfer.files);

})

function uploadTorrent(fileList: FileList) {
  const openFileButton = document.getElementById('toolbar-open');
  const fileUploadElement: any = document.getElementById('torrent_upload_file');
  openFileButton!.click();

  fileUploadElement.files = fileList;
  const uploadButton = document.getElementById('upload_confirm_button');
  uploadButton!.click();
}


