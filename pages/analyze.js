const path = require('path');
const { dialog } = require('electron').remote;

const submit = document.querySelector('[type=submit]');
const folderToShow = document.querySelector('#folderShow');

sessionStorage.setItem('folder', '');

document.querySelector('#select').addEventListener('click', (event) => {
    let options = {properties:["openDirectory"]}
    //Synchronous reading folder path
    let dir = dialog.showOpenDialogSync(options);
    if (dir == undefined) {
        folderToShow.innerHTML = '';
        sessionStorage.removeItem('folder');
        submit.setAttribute('disabled', '');
    } else {
        folderToShow.innerHTML = dir
        sessionStorage.setItem('folder', dir);
        submit.removeAttribute('disabled');
    }
    console.log(dir)
});

