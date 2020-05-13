const electron = require('electron');
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

const indexData = require('./data.js');


let selectedFilePath;


async function OpenFolderDiolog(){    
    let promise = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    
    indexData.Path = selectedFilePath[0];
    console.log(indexData.Path);
    document.getElementById('directoryDisplay').value = indexData.Path;
}

function subtitlesClick(){
    if(document.getElementById('chkSubs').checked == true){ 

        const win = new BrowserWindow({
              height: 200,
              width: 320,
              resizable: false,
              frame: false,
              webPreferences: {
                nodeIntegration: true
              }
        });
          
            win.loadURL('file://' + __dirname +'/subtitlePrompt.html');
        
    }
    else{
        indexData.SubLang ="eng";
    }
    console.log(indexData.SubLang);
}

function subtitleWindowDone(){
    indexData.SubLang = "failed";
    indexData.SubLang = document.getElementById('txtSubLang').value;
    console.log(indexData.SubLang);
    window.close();
}

function subtitleWindowCancel(){
    indexData.SubLang = "eng";
    window.close();
}

function epiClick(){
    if(document.getElementById('chkEpisode').checked == true){
         indexData.StartingEp = prompt("Enter starting episode (Default 1)","1");
    }
    else{
        indexData.StartingEp = 1;
    }
    console.log(indexData.StartingEp);
}
