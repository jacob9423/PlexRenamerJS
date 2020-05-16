const electron = require('electron');
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;

const indexData = require('./../js/data.js');


let selectedFilePath;

async function rename(){
    indexData.NameOfShow = document.getElementById('txtShowName').value;
    indexData.Season = document.getElementById('numSeason').value;
    indexData.newFileNames = newFileNames(indexData.OldfileNames,indexData.OldfileNames.length,indexData.StartingEp);
    displayList(indexData.newFileNames);
    console.log(indexData.newFileNames);
}

function newFileNames(OldNames,OldNameCount,StartingEp){
    let NewNames = [];
    let SeasonString = indexData.Season;
    let EpCount = indexData.StartingEp;

    if (indexData.Season < 10)
    {
        SeasonString = "0" + indexData.Season;
    }

    for (let i = 0; i < OldNameCount; i++)
    {
        if (EpCount < 10)
        {
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${SeasonString}e0${EpCount}${indexData.FileType}`);
        }
        else
        {
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${SeasonString}e${EpCount}${indexData.FileType}`);
        }
        EpCount++;
    }

    return NewNames;
}

async function OpenFolderDiolog(){    
    let promise = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    indexData.Path = selectedFilePath[0];
    console.log(indexData.Path);
    getFileNames();
    displayList(indexData.OldfileNames);   
}

async function refreshList(){
    getFileNames();
    displayList(indexData.OldfileNames);
}

async function getFileNames(){
    document.getElementById('directoryDisplay').value = indexData.Path;
    indexData.OldfileNames = fs.readdirSync(indexData.Path);
    indexData.FileType = path.extname(indexData.OldfileNames[0])
    console.log(indexData.OldfileNames);
    console.log(indexData.FileType);
}

function displayList(listToDisplay){
    document.getElementById('listOfFiles').innerHTML = "";
    listToDisplay.forEach(function(listToDisplay){
        var li = document.createElement("a");
        li.text = listToDisplay;
        document.getElementById('listOfFiles').appendChild(li);
        console.log("working");
    });
}

function subtitlesClick(){
    if(document.getElementById('chkSubs').checked){ 

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
        indexData.SubLangBool;
    }
    console.log(indexData.SubLang);
}

function subtitleWindowDone(){
    indexData.SubLang = document.getElementById('txtSubLang').value;
    indexData.SubLangBool = true;
    console.log(indexData.SubLang);
    window.close();
}

function subtitleWindowCancel(){
    indexData.SubLangBool = false;
    window.close();
}

function epiClick(){
        if(document.getElementById('chkEpisode').checked == true){ 
    
            const window = new BrowserWindow({
                  height: 180,
                  width: 260,
                  resizable: false,
                  frame: false,
                  webPreferences: {
                    nodeIntegration: true
                  }
            });
              
            window.loadURL('file://' + __dirname +'/episodePrompt.html');
        }
        else{
            indexData.StartingEp = 1;
        }      
}

function epiDone(){
    indexData.StartingEp = document.getElementById('numEpisode').value;
    window.close();
}

function epiCancel(){
    indexData.StartingEp = 1;
    window.close();
}
