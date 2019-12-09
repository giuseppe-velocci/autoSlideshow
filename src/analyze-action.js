const fs = require('fs');
const allowedExtensions = /(jpg|jpeg)$/;

const folder = sessionStorage.getItem('folder');
const resElement = document.querySelector('.res');
const progressElement = document.querySelector('#message');

const goBackBtn = () => {
    resElement.innerHTML += `
<style> h1 {margin-top: 100px; font-family: Helvetica; text-align:center; font-weight: normal;} </style>
<style> .btn { margin-top: 50px; font-family: Helvetica; text-align:center; border-radius: 3px; border: grey solid 1px; color: grey; background: black; padding:6px} </style>
<h1>You can return to Home</p>
<button type="button" class="btn" onclick="window.location.href = '../index.html';">Home</button>`;
}

// check internet connection
if (! window.navigator.onLine) {
    resElement.innerHTML = '<h3 class="err">No Internet connection.' 
       + 'Please check your connection and try again.</h3>';
    goBackBtn ();
    throw new Error("No internet connection");
}


console.log(folder);

// check if a folder was selected
if (folder == null) {
    resElement.innerHTML = 'No files found to be analyzed.';
    goBackBtn();
    throw new Error(); // block script exectution
}

// read all files inside the folder and filter only those with valid extension
const fileList = fs.readdirSync(folder);
fileList.img = fileList.filter((x) => {
    return allowedExtensions.test(x);
});
const validImgsNum = fileList.img.length;

// if no valid files were found: stop
console.log(fileList.img);
if (validImgsNum < 1) {
    resElement.innerHTML = 'No valid images found inside the given folder.';
    goBackBtn();
    throw new Error();
}

// then setup an array with data to be passed in analysis

// if everything is ok: start processing data
(async function (){
        function progress (v) {
            let completed = 0;
            const percent = document.querySelector("#progress");
            return () => {
                //console.log(completed);
                percent.innerHTML = Math.round(100 * (++completed / v)) + '%';
            };
        };

        await multiCall(folder, fileList, progress(validImgsNum));
    })().then((data) =>{
    resElement.innerHTML = '';
    progressElement.innerHTML = `<style> h1 {font-family: Helvetica; text-align:center; font-weight: normal;} </style><h1>Operation complete.</p>`;
    goBackBtn();
});
