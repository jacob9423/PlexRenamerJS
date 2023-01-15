const electron = require('electron');
const dialog = require('@electron/remote').dialog;
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const path = require('path');
const home = require('os').homedir();



const fileTools = require('./../js/fileTools.js');
//const { data } = require('./../js/fileTools.js');


let selectedFilePath;

configCheck();


async function rename(){
    // to check if ther user is running this program a secound time. 
    // If so they could have already picked a directory and would like to use the one they already selected
    if(fileTools.data.firstRun){
        //get out of if statements and go on and run the program
    } else if (fileTools.data.oldFileNames.length != 0 && !fileTools.data.noPath){
        fileTools.data.clearData(false);
    } else if(fileTools.data.oldFileNames.length != 0){
        fileTools.data.clearData(true);
    }

    await checkIfNoPath();

    getShowData();
    fileTools.createOrWriteConfig();

    // logic for renaming files. Checks if subtiles are checked and if not rename files the normal way
    if (document.getElementById('chkSubs').checked){
        if(!document.getElementById('txtSubLang').value){
            fileTools.data.subLang = document.getElementById('txtSubLang').value;
        }
        fileTools.data.newFileNames = fileTools.generateNewNamesForSubs(fileTools.data.oldFileNames.length, fileTools.data.startingEp);
    } else{
        fileTools.data.newFileNames = fileTools.generateNewNames(fileTools.data.oldFileNames.length, fileTools.data.startingEp);
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
        fileTools.renameFiles();
        fileTools.getFileNames();
        displayList(fileTools.data.newFileNames);
        fileTools.data.noPath = true;
    }
    fileTools.data.firstRun = false;   
}

async function openFolderDialog(){    
    let promise = await (dialog.showOpenDialog({defaultPath: `${fileTools.data.initalPath}` , properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    fileTools.data.path = selectedFilePath[0];
    //set InitialPath after file is selected to be used for directory remembering
    fileTools.data.initalPath = fileTools.data.path;
    fileTools.getFileNames();
    displayList(fileTools.data.oldFileNames);  
    fileTools.data.noPath = false; 
}

async function checkIfNoPath(){
    if (fileTools.data.noPath){
       await openFolderDialog();
    }
}

function refreshList(){
    fileTools.getFileNames();
    displayList(fileTools.data.oldFileNames);
}

function displayList(listToDisplay){
    document.getElementById('listOfFiles').innerHTML = "";
    listToDisplay.forEach(function(listToDisplay){
        var li = document.createElement("a");
        li.text = listToDisplay;
        document.getElementById('listOfFiles').appendChild(li);
    });
}

function getShowData(){
    fileTools.data.nameOfShow = document.getElementById('txtShowName').value;
    fileTools.data.season = document.getElementById('numSeason').value;
    fileTools.getFileNames();

    // to fix a bug where if the user picks a folder with only folders in it the program will error out.
    try{
        fileTools.data.fileType = path.extname(fileTools.data.oldFileNames[0]);
    }
    catch{
        dialog.showErrorBox('Renaming folders are we?','Are you trying to rename a Folder without video files in it? Please select another folder');
        openFolderDialog();
    }
}

function configCheck(){
    if(fileTools.checkConfig()){
        fileTools.loadConfig();
    }else{
        fileTools.createOrWriteConfig();
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
    fileTools.data.subLang = document.getElementById('txtSubLang').value;
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
        fileTools.data.startingEp = 1;
    }  
}

function epiDone(){
    fileTools.data.startingEp = document.getElementById('numEpisode').value;
    document.getElementById('epiDiv').style.display = "none"; 
}

function epiCancel(){
    fileTools.data.startingEp = 1;
    document.getElementById('epiDiv').style.display = "none"; 
}
