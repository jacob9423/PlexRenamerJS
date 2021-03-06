const fs = require('fs');
const path = require('path');
const data = require('./../js/data.js');
const home = require('os').homedir();
const isMac = require('os').platform();

// variables for use in fileTools.js 
var dirPath = home + '/Documents/PlexRenamerJSConfig.json';
var defaultPath = home + '/Documents';
var json;


module.exports={data,getFileNames,renameFiles,generateNewNames,generateNewNamesForSubs,createOrWriteConfig,loadConfig,checkConfig};

function getFileNames(){
    document.getElementById('directoryDisplay').value = data.path;
    let dirents = fs.readdirSync(data.path, {withFileTypes: true});
    // filter out directorys from resaults
    data.oldFileNames = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);

    //Check if the platform is mac. If so remove .DS_Store from list
    if (isMac == "darwin"){
        console.log(isMac);
        var index = data.oldFileNames.indexOf(".DS_Store");
        if (index > -1){
            data.oldFileNames.splice(index,1)
        }
    }
    //Only get the file type after we know there is no .DS_Store files
    data.fileType = path.extname(data.oldFileNames[0]);
}

function renameFiles(){
    let oldFiles = [];
    
    for (let i = 0; i < data.oldFileNames.length; i++){
        oldFiles.push(data.path + "/" + data.oldFileNames[i]);
    }     
    for (let i = 0; i < data.oldFileNames.length; i++){
        fs.renameSync(oldFiles[i], data.newFileNames[i]);
    }
}

function generateNewNames(oldNameCount,startingEp){
    let newNames = [];
    let epCount = startingEp;
    let seasonString;
    
    if (data.season < 10){
        seasonString = "0" + data.season;
    } else {
        seasonString = data.season;
    }
    
    for (let i = 0; i < oldNameCount; i++){
        if (epCount < 10){
            newNames.push(`${data.path}/${data.nameOfShow} - s${seasonString}e0${epCount}${data.fileType}`);
        }else{
            newNames.push(`${data.path}/${data.nameOfShow} - s${seasonString}e${epCount}${data.fileType}`);
        }
        epCount++;
    }
    return newNames;
}

function generateNewNamesForSubs(oldNameCount,startingEp){
    let newNames = [];
    let seasonString;
    let epCount = startingEp;

    if (!data.subLang){
        data.subLang = "eng";
    }

    if (data.season < 10){
        seasonString = "0" + data.season;
    } else {
        seasonString = data.season;
    }

    for (let i = 0; i < oldNameCount; i++){
        if (epCount < 10){
            newNames.push(`${data.path}/${data.nameOfShow} - s${seasonString}e0${epCount}.${data.subLang}${data.fileType}`);
        } else{
            newNames.push(`${data.path}/${data.nameOfShow} - s${seasonString}e${epCount}.${data.subLang}${data.fileType}`);
        }
        epCount++;
    }
    return newNames;
}

function createConfigFileIfNone(){
    fs.writeFileSync(dirPath,{overwrite: false});
}

function loadConfig(){
    let file = fs.readFileSync(dirPath);
    json = JSON.parse(file);
    if(!json.strDir){
        data.initalPath = dirPath;
    }else{
        data.initalPath = json.strDir;
    }
}

function createOrWriteConfig(){
    let jsonData 
// Create jasondata with the current path if sleected. If not write the default path
    if(data.path){
        jsonData = {
            strDir: `${data.path}`
        }
    }else{
        jsonData = {
            strDir: `${defaultPath}`
        }
        data.initalPath = defaultPath;
    }
         
    var jsonString = JSON.stringify(jsonData);

    if(fs.existsSync(dirPath)){
        
        fs.writeFileSync(dirPath,jsonString);
    }
    else{
        createConfigFileIfNone();
        fs.writeFileSync(dirPath,jsonString);
    }
}

function checkConfig(){
    if(fs.existsSync(dirPath)){
        return true;
    }else{
        return false;
    }
}