
var oldFileNames = [];
var newFileNames = [];
var path;
var initalPath;
var fileType;
var numOfFiles;
var nameOfShow;
var season;
var subLang;
var subLangBool = false;
var noPath = true;
var firstRun = true;
var startingEp = 1;

function clearData(clearDirectory){
            if (!clearDirectory){
                // no need to change path
                noPath = false;
            }else{
                path = "null";
                noPath = true;
            }
            oldFileNames = [];
            newFileNames = [];
            fileType = "null";
            numOfFiles = 0;
            nameOfShow = "Please enter show name";
            subLang = null;
            season = 1;
            startingEp = 1;
        }
module.exports={oldFileNames, newFileNames, path, initalPath, fileType, numOfFiles, nameOfShow, season, subLang, noPath, firstRun, startingEp,subLangBool,clearData};
    