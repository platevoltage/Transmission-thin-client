import { contextBridge, ipcRenderer } from 'electron';

ipcRenderer.on("getCSS", (_event, styleSheet) => {

    const head = document.querySelector('head');
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css')
    head!.appendChild(link);

    const body = document.querySelector('body');
    const style = document.createElement('style');

    style.textContent = styleSheet;
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

    swapIconWithBootstrap("settings_menu", "bi bi-gear-wide-connected");
    swapIconWithBootstrap("prefs-button", "bi bi-wrench");
    swapIconWithBootstrap("turtle-button", "bi bi-cone-striped");
    swapIconWithBootstrap("compact-button", "bi bi-chevron-bar-contract");

    swapIconWithBootstrap("inspector-tab-info", "bi bi-gear-wide-connected");
    swapIconWithBootstrap("inspector-tab-peers", "bi bi-wrench");
    swapIconWithBootstrap("inspector-tab-trackers", "bi bi-cone-striped");
    swapIconWithBootstrap("inspector-tab-files", "bi bi-chevron-bar-contract");

    createLoginButton();
  

});
contextBridge.exposeInMainWorld("api", {
    login: () => ipcRenderer.send('log-in-button-clicked'),
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

function createLoginButton() {
  const footer = document.getElementsByClassName('torrent_footer')[0];
  const button = document.createElement('div');
  button.setAttribute('id', 'login');
  // button.setAttribute('onClick', '() => console.log("dsfsd)')
  button.innerHTML = `<i class="bi bi-box-arrow-in-right"></i>`
  button.addEventListener('click', () => {
    ipcRenderer.send("log-in-button-clicked");
  })
  footer.appendChild(button);
}


