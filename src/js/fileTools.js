const fs = require('fs');
const path = require('path');
const BrowserWindow = remote.BrowserWindow;
const Data = require('./../js/data.js');
const data = require('./../js/data.js');
const Home = require('os').homedir();

// variables for use in fileTools.js 
var DirPath = Home + '/Documents/PlexRenamerJSConfig.json';
var json;

module.exports={Data,getFileNames,RenameFiles,GenerateNewNames,GenerateNewNamesForSubs,CreateOrWriteConfig,LoadConfig,CheckConfig};

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
        if (Data.Season < 10){
            SeasonString = "0" + Data.Season;
        } else {
            SeasonString = Data.Season;
        }
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

function CreateConfigFileIfNone(){
    fs.writeFileSync(DirPath,{overwrite: false});
}

function LoadConfig(){
    let file = fs.readFileSync(DirPath);
    json = JSON.parse(file);
    if(!json.strDir){
        Data.InitalPath = DirPath;
    }else{
        Data.InitalPath = json.strDir;
    }
}

function CreateOrWriteConfig(){
    let jsonData = {
        strDir: `${Data.Path}`
    }

    if(fs.existsSync(DirPath)){
        let jsonString = JSON.stringify(jsonData);
        fs.writeFileSync(DirPath,jsonString);
    }
    else{
        CreateConfigFileIfNone();
    }
}

function CheckConfig(){
    if(fs.existsSync(DirPath)){
        return true;
    }else{
        return false;
    }
}