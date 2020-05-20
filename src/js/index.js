const electron = require('electron');
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;

const fileTools =require('./../js/fileTools.js');


let selectedFilePath;

function rename(){
    // to check if ther user is running this program a secound time. 
    // If so they could have already picked a directory and would like to use the one they already selected
    if(fileTools.indexData.FirstRun){
        //get out of if statements and go on and run the program
    } else if (fileTools.indexData.OldfileNames.length != 0 && !fileTools.indexData.NoPath){
        fileTools.indexData.clearData(false);
    } else if(fileTools.indexData.OldfileNames.length != 0){
        fileTools.indexData.clearData(true);
    }

    // if(document.getElementById('chkEpisode').checked){
    //     fileTools.indexData.StartingEp = document.getElementById('numEpisode').value;
    // }

    CheckIfNoPath();
    GetShowData();


    if (document.getElementById('chkSubs').checked){
        if(!document.getElementById('txtSubLang').value){
            fileTools.indexData.SubLang = document.getElementById('txtSubLang').value;
        }
        fileTools.indexData.NewFileNames = fileTools.GenerateNewNamesForSubs(fileTools.indexData.OldFileNames, fileTools.indexData.OldfileNames.length, fileTools.indexData.StartingEp);
    } else{
        fileTools.indexData.NewFileNames = fileTools.GenerateNewNames(fileTools.indexData.OldFileNames, fileTools.indexData.OldfileNames.length, fileTools.indexData.StartingEp);
    }
    //let confirmBox = confirm("Are you sure you sure you want to rename?");
    let confrimBoxOptions = {
        type: 'question',
        buttons: ['No', 'yes', ],
        defaultId: 1,
        title: 'Question',
        message: 'Are you sure you sure you want to rename?',
        detail: 'Pressing rename will rename ALL files in directory. Please separate subtitles into a separate directory or they will be renamed with all the other files.',
    }
    let confirmBox = dialog.showMessageBoxSync(null,confrimBoxOptions);
    if (confirmBox == 1){
        fileTools.RenameFiles();
        fileTools.getFileNames();
        displayList(fileTools.indexData.NewFileNames);
        fileTools.indexData.NoPath = true;
    }
    fileTools.indexData.FirstRun = false;   
}

async function OpenFolderDialog(){    
    let promise = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    fileTools.indexData.Path = selectedFilePath[0];
    fileTools.getFileNames();
    displayList(fileTools.indexData.OldfileNames);  
    fileTools.indexData.NoPath = false; 
}

function CheckIfNoPath(){
    if (fileTools.indexData.NoPath){
        OpenFolderDialog();
    }
}

function refreshList(){
    fileTools.getFileNames();
    displayList(fileTools.indexData.OldfileNames);
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

function GetShowData(){
    fileTools.indexData.NameOfShow = document.getElementById('txtShowName').value;
    fileTools.indexData.Season = document.getElementById('numSeason').value;
    fileTools.getFileNames();

    // to fix a bug where if the user picks a folder with only folders in it the program will error out.
    try{
        fileTools.indexData.FileType = path.extname(fileTools.indexData.OldfileNames[0]);
    }
    catch{
        // alert("Are you trying to rename a Folder without video files in it? Please select another folder");
        dialog.showErrorBox('Renaming folders are we?','Are you trying to rename a Folder without video files in it? Please select another folder');
        OpenFolderDialog();
    }
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
        fileTools.indexData.SubLangBool;
    }
    console.log(indexData.SubLang);
}

function subtitleWindowDone(){
    fileTools.indexData.SubLang = document.getElementById('txtSubLang').value;
    fileTools.indexData.SubLangBool = true;
    console.log(indexData.SubLang);
    window.close();
}

function subtitleWindowCancel(){
    fileTools.indexData.SubLangBool = false;
    window.close();
}

function epiClick(){
    if(document.getElementById('chkEpisode').checked){ 

        const window = new BrowserWindow({
              height: 180,
              width: 260,
              resizable: false,
              frame: true,
              webPreferences: {
                nodeIntegration: true
              }
        });
          
        window.loadURL('file://' + __dirname +'/episodePrompt.html');
    }
    else{
        fileTools.indexData.StartingEp = 1;
    }      
}

function epiDone(){
    let returnToMain = parseInt(document.getElementById('numEpisode').value);
    ipcRenderer.send('fromEpiDone',returnToMain);
    window.close();
}

function epiCancel(){
    fileTools.indexData.StartingEp = 1;
    window.close();
}

