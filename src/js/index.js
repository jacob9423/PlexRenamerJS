const electron = require('electron');
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;


const fileTools = require('./../js/fileTools.js');


let selectedFilePath;

async function rename(){
    // to check if ther user is running this program a secound time. 
    // If so they could have already picked a directory and would like to use the one they already selected
    if(fileTools.Data.FirstRun){
        //get out of if statements and go on and run the program
    } else if (fileTools.Data.OldfileNames.length != 0 && !fileTools.Data.NoPath){
        fileTools.Data.clearData(false);
    } else if(fileTools.Data.OldfileNames.length != 0){
        fileTools.Data.clearData(true);
    }
  
    await CheckIfNoPath();

    GetShowData();

    // logic for renaming files. Checks if subtiles are checked and if not rename files the normal way
    if (document.getElementById('chkSubs').checked){
        if(!document.getElementById('txtSubLang').value){
            fileTools.Data.SubLang = document.getElementById('txtSubLang').value;
        }
        fileTools.Data.NewFileNames = fileTools.GenerateNewNamesForSubs(fileTools.Data.OldFileNames, fileTools.Data.OldfileNames.length, fileTools.Data.StartingEp);
    } else{
        fileTools.Data.NewFileNames = fileTools.GenerateNewNames(fileTools.Data.OldFileNames, fileTools.Data.OldfileNames.length, fileTools.Data.StartingEp);
    }

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
        displayList(fileTools.Data.NewFileNames);
        fileTools.Data.NoPath = true;
    }
    fileTools.Data.FirstRun = false;   
}

async function OpenFolderDialog(){    
    let promise = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    fileTools.Data.Path = selectedFilePath[0];
    fileTools.getFileNames();
    displayList(fileTools.Data.OldfileNames);  
    fileTools.Data.NoPath = false; 
}

async function CheckIfNoPath(){
    if (fileTools.Data.NoPath){
        OpenFolderDialog();
    }
}

function refreshList(){
    fileTools.getFileNames();
    displayList(fileTools.Data.OldfileNames);
}

function displayList(listToDisplay){
    document.getElementById('listOfFiles').innerHTML = "";
    listToDisplay.forEach(function(listToDisplay){
        var li = document.createElement("a");
        li.text = listToDisplay;
        document.getElementById('listOfFiles').appendChild(li);
    });
}

function GetShowData(){
    fileTools.Data.NameOfShow = document.getElementById('txtShowName').value;
    fileTools.Data.Season = document.getElementById('numSeason').value;
    fileTools.getFileNames();

    // to fix a bug where if the user picks a folder with only folders in it the program will error out.
    try{
        fileTools.Data.FileType = path.extname(fileTools.Data.OldfileNames[0]);
    }
    catch{
        dialog.showErrorBox('Renaming folders are we?','Are you trying to rename a Folder without video files in it? Please select another folder');
        OpenFolderDialog();
    }
}

function subtitlesClick(){
    if(document.getElementById('chkSubs').checked){
        document.getElementById('subDiv').style.display = "block";
        document.getElementById('txtSubLang').focus();
    } else {
        document.getElementById('subDiv').style.display = "none"; 
    }  
}

function subtitleWindowDone(){
    fileTools.Data.SubLang = document.getElementById('txtSubLang').value;
    document.getElementById('subDiv').style.display = "none"; 
}

function subtitleWindowCancel(){
    document.getElementById('subDiv').style.display = "none"; 
}

function epiClick(){
    if(document.getElementById('chkEpisode').checked){
        document.getElementById('epiDiv').style.display = "block";
        document.getElementById('numEpisode').focus();

    } else {
        document.getElementById('epiDiv').style.display = "none"; 
        fileTools.Data.StartingEp = 1;
    }  
}

function epiDone(){
    fileTools.Data.StartingEp = document.getElementById('numEpisode').value;
    document.getElementById('epiDiv').style.display = "none"; 
}

function epiCancel(){
    fileTools.Data.StartingEp = 1;
    document.getElementById('epiDiv').style.display = "none"; 
}
