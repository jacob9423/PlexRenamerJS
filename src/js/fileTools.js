const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;
const Data = require('./../js/Data.js');
var test;

module.exports={Data,getFileNames,RenameFiles,GenerateNewNames,GenerateNewNamesForSubs};

// get starting episode from episode window if it was sent
ipcRenderer.send('requestFromIndexForStartEp');
ipcRenderer.on('responceToIndexForStartep', function(event, Data) {
test = Data;
console.log(Data.StartingEp + "this is from the Filetools");
});


function getFileNames(){
    document.getElementById('directoryDisplay').value = Data.Path;
    Data.OldfileNames = fs.readdirSync(Data.Path);
    Data.FileType = path.extname(Data.OldfileNames[0]);
    console.log(Data.OldfileNames);
}

function RenameFiles(){
    let oldFiles = [];
    
    for (let i = 0; i < Data.OldfileNames.length; i++){
        oldFiles.push(Data.Path + "/" + Data.OldfileNames[i]);
        }     
        for (let i = 0; i < Data.OldfileNames.length; i++){
            fs.renameSync(oldFiles[i], Data.NewFileNames[i]);
        }
    }

function GenerateNewNames(OldNames,OldNameCount,StartingEp){
    let NewNames = [];
    let EpCount = StartingEp;
    let SeasonString;

    if (Data.Season < 10){
        SeasonString = "0" + Data.Season;
    } else {
        SeasonString = Data.Season;
    }

    for (let i = 0; i < OldNameCount; i++){
        if (EpCount < 10){
           NewNames.push(`${Data.Path}/${Data.NameOfShow} - s${SeasonString}e0${EpCount}${Data.FileType}`);
        }else{
           NewNames.push(`${Data.Path}/${Data.NameOfShow} - s${SeasonString}e${EpCount}${Data.FileType}`);
        }
        console.log(EpCount);
        EpCount++;
    }
    return NewNames;
}

function GenerateNewNamesForSubs(OldNames,OldNameCount,StartingEp){
    let NewNames = [];
    let SeasonString;
    let EpCount = StartingEp;

    if (!Data.SubLang){
        Data.SubLang = "eng";
    }

    if (Data.Season < 10){
        SeasonString = "0" + Data.Season;
    } else {
        SeasonString = Data.Season;
    }

    for (let i = 0; i < OldNameCount; i++){
        if (EpCount < 10){
            NewNames.push(`${Data.Path}/${Data.NameOfShow} - s${SeasonString}e0${EpCount}.${Data.SubLang}${Data.FileType}`);
        } else{
            NewNames.push(`${Data.Path}/${Data.NameOfShow} - s${SeasonString}e${EpCount}.${Data.SubLang}${Data.FileType}`);
        }
        EpCount++;
    }
    return NewNames;
}