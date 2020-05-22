const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;
const Data = require('./../js/Data.js');
var test;

module.exports={Data,getFileNames,RenameFiles,GenerateNewNames,GenerateNewNamesForSubs};

function getFileNames(){
    document.getElementById('directoryDisplay').value = Data.Path;
    let dirents = fs.readdirSync(Data.Path, {withFileTypes: true});
    // filter out directorys from resaults
    Data.OldfileNames = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
    Data.FileType = path.extname(Data.OldfileNames[0]);
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