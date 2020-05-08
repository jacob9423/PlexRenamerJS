const electron = require('electron');
const dialog = require('electron').remote.dialog;
// make folderPickerButton activate folderPicker

async function OpenFolderDiolog(){
     //document.getElementById('folderPicker').click();
    
    // console.log(document.getElementById('folderPicker').value);
    // console.log("test");
    
    let testing = "failed";
    let test = await (dialog.showOpenDialog({ properties: ['openDirectory']}).then((data) => {testing=data.filePaths;}));
    console.log(test);
    console.log(testing[0]);
    document.getElementById('directoryDisplay').value = testing[0];
}
