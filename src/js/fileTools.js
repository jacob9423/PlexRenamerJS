const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;
const indexData = require('./../js/data.js');

module.exports={indexData,getFileNames,RenameFiles,GenerateNewNames,GenerateNewNamesForSubs};

function getFileNames(){
    document.getElementById('directoryDisplay').value = indexData.Path;
    indexData.OldfileNames = fs.readdirSync(indexData.Path);
    indexData.FileType = path.extname(indexData.OldfileNames[0]);
}

function RenameFiles(){
    let oldFiles = [];
    
    for (let i = 0; i < indexData.OldfileNames.length; i++){
        oldFiles.push(indexData.Path + "/" + indexData.OldfileNames[i]);
        }     
        for (let i = 0; i < indexData.OldfileNames.length; i++){
            fs.renameSync(oldFiles[i], indexData.NewFileNames[i]);
        }
    }

function GenerateNewNames(OldNames,OldNameCount,StartingEp){
    let NewNames = [];
    let EpCount = StartingEp;
    let SeasonString = indexData.Season;
    console.log(EpCount);

    if (indexData.Season < 10){
        SeasonString = "0" + indexData.Season;
    }

    for (let i = 0; i < OldNameCount; i++){
        if (EpCount < 10){
            //NewNames.push(indexData.Path + "/" + indexData.NameOfShow + " - " + "s" + SeasonString + "e" + "0" + EpCount + indexData.FileType);
           NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${SeasonString}e0${EpCount}${indexData.FileType}`);
        }else{
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
        if (EpCount < 10){
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${indexData.Season}e0${EpCount}.${indexData.SubLang}.${FileData.FileType}`);
        } else{
            NewNames.push(`${indexData.Path}/${indexData.NameOfShow} - s${indexData.Season}e${EpCount}.${indexData.SubLang}.${FileData.FileType}`);
        }
        EpCount++;
    }
    return NewNames;
}