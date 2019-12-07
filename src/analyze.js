const path = require('path');
const { dialog } = require('electron').remote;

const submit = document.querySelector('[type=submit]');
const folderToShow = document.querySelector('#folderShow');

sessionStorage.setItem('folder', '');

// check internet connection
if (! window.navigator.onLine) {
    document.querySelector('#msg').innerHTML = '<h3 class="err">No Internet connection.' 
       + 'Please check your connection since it is needed to fulfill analysis tasks.</h3>';
}

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

