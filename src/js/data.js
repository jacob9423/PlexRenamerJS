
var OldfileNames = [];
var NewFileNames = [];
var Path;
var InitalPath;
var FileType;
var NumOfFiles;
var NameOfShow;
var Season;
var SubLang;
var SubLangBool = false;
var NoPath = true;
var FirstRun = true;
var StartingEp = 1;

function clearData(ClearDirectory){
            if (!ClearDirectory){
                // no need to change path
                NoPath = false;
            }else{
                Path = "null";
                NoPath = true;
            }
            OldFileNames = [];
            NewFileNames = [];
            FileType = "null";
            NumOfFiles = 0;
            NameOfShow = "Please enter show name";
            SubLang = null;
            Season = 0;
            SubLangBool = false;
        }
module.exports={OldfileNames, NewFileNames, Path, InitalPath, FileType, NumOfFiles, NameOfShow, Season, SubLang, NoPath, FirstRun, StartingEp,SubLangBool,clearData};
    