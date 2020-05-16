const electron = require('electron');
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;

const indexData = require('./../js/data.js');


let selectedFilePath;

function rename(){
    // to check if ther user is running this program a secound time. 
    //If so they could have already picked a directory and would like to use the one they already selected
    // if(indexData.FirstRun){
    //     //get out of if statements and go on and run the program
    // }
    // else if (indexData.OldfileNames.length != 0 && !indexData.NoPath){
    //     indexData.clearData(false);
    // }
    // else if(indexData.OldfileNames.length != 0)
    // {
    //     indexData.clearData(true);
    // }

    //indexData.StartingEp = document.getElementById('numEpisode').value;
    
    CheckIfNoPath();
    GetShowData();

    if (document.getElementById('chkSubs').checked){
        if(!document.getElementById('txtSubLang').value){
            indexData.SubLang = document.getElementById('txtSubLang').value;
        }
        indexData.NewFileNames = GenerateNewNamesForSubs(indexData.OldFileNames, indexData.OldfileNames.length, indexData.StartingEp);
    }
    else{
        indexData.NewFileNames = GenerateNewNames(indexData.OldFileNames, indexData.OldfileNames.length, indexData.StartingEp);
    }

    let confirmBox = confirm("Are you sure you sure you want to rename?")
    if (confirmBox){
        RenameFiles();
        getFileNames();
        displayList(indexData.NewFileNames);
        indexData.NoPath = true;
    }
    indexData.FirstRun = false;   
}

function GenerateNewNames(OldNames,OldNameCount,StartingEp){
    var NewNames = [];
    var EpCount = indexData.StartingEp;
    var SeasonString = indexData.Season;

    if (indexData.Season < 10)
    {
        SeasonString = "0" + indexData.Season;
    }

    for (let i = 0; i < OldNameCount; i++)
    {
        if (EpCount < 10)
        {
            //NewNames.push(indexData.Path + "/" + indexData.NameOfShow + " - " + "s" + SeasonString + "e" + "0" + EpCount + indexData.FileType);
           NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${SeasonString}e0${EpCount}${indexData.FileType}`);
        }
        else
        {
            //NewNames.push(indexData.Path + "/" + indexData.NameOfShow + " - " + "s" + SeasonString + "e" + EpCount + indexData.FileType);
           NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${SeasonString}e${EpCount}${indexData.FileType}`);
        }
        EpCount++;
    }
    return NewNames;
}

function GenerateNewNamesForSubs(OldNames,OldNameCount,StartingEp){
    let NewNames = [];
    let SeasonString = FileData.Season;
    let EpCount = StartingEp;

    if (!indexData.SubLang){
        indexData.SubLang = "eng";
    }

    if (indexData.Season < 10){
        SeasonString = "0" + indexData.Season;
    }

    for (let i = 0; i < OldNameCount; i++){
        if (EpCount < 10)
        {
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${indexData.Season}e0${EpCount}.${indexData.SubLang}.${FileData.FileType}`);
        }
        else
        {
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${indexData.Season}e${EpCount}.${indexData.SubLang}.${FileData.FileType}`);
        }
        EpCount++;
    }
    return NewNames;
}

async function OpenFolderDialog(){    
    let promise = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {selectedFilePath=data.filePaths;}));
    indexData.Path = selectedFilePath[0];
    getFileNames();
    displayList(indexData.OldfileNames);  
    indexData.NoPath = false; 
}

function refreshList(){
    getFileNames();
    displayList(indexData.OldfileNames);
}

function getFileNames(){
    document.getElementById('directoryDisplay').value = indexData.Path;
    indexData.OldfileNames = fs.readdirSync(indexData.Path);
    indexData.FileType = path.extname(indexData.OldfileNames[0]);
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

function CheckIfNoPath(){
    if (indexData.NoPath){
        OpenFolderDialog();
    }
}

function GetShowData(){
    indexData.NameOfShow = document.getElementById('txtShowName').value;
    indexData.Season = document.getElementById('numSeason').value;
    getFileNames();

    // to fix a bug where if the user picks a folder with only folders in it the program will error out.
    try
    {
        indexData.FileType = path.extname(indexData.OldfileNames[0]);
    }
    catch
    {
        alert("Are you trying to rename a Folder without video files in it? Please select another folder");
        OpenFolderDialog();
    }

}

function RenameFiles(){
let oldFiles = [];


for (let i = 0; i < indexData.OldfileNames.length; i++){
    oldFiles.push(indexData.Path + "/" + indexData.OldfileNames[i]);
    }
 
    console.log(oldFiles);
    console.log(indexData.NewFileNames);
 
    for (let i = 0; i < indexData.OldfileNames.length; i++){
        fs.renameSync(oldFiles[i], indexData.NewFileNames[i]);
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
