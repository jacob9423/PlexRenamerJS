
let OldfileNames;
let NewFileNames;
let Path;
let InitalPath;
let FileType;
let NumOfFiles;
let NameOfShow;
let Season;
let SubLang;
let NoPath = true;
let FirstRun = false;
let StartingEp = 1;

function clearData(ClearDirectory){
            if (ClearDirectory == false){
                // no need to change path
                NoPath = false;
            }else{
                Path = "null";
                NoPath = true;
            }
            OldFileNames.Clear();
            NewFileNames.Clear();
            FileType = "null";
            NumOfFiles = 0;
            NameOfShow = "Please enter show name";
            SubLang = null;
            Season = 0;
        }
module.exports={OldfileNames, NewFileNames, Path, InitalPath, FileType, NumOfFiles, NameOfShow, Season, SubLang, NoPath, FirstRun, StartingEp,clearData};
    