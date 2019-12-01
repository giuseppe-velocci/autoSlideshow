const fs = require('fs');

const resElement = document.querySelector('.res');
const folder = sessionStorage.getItem('folder');
const allowedExtensions = /(jpg|jpeg)$/;

console.log(folder);

const goBackBtn = () => {
    resElement.innerHTML += '<p>Back to <a href="../index.html">Home</a></p>';
}


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

// if no valid files were found: stop
console.log(fileList.img);
if (fileList.img.length < 1) {
    resElement.innerHTML = 'No valid images found inside the given folder.';
    goBackBtn();
    throw new Error();
}

// if everything is ok: start processing data


const action = (file) => {
    detect(file).then((data) => {
        resElement.innerHTML = data.detection[0].class
        + " --> " + data.width + " x " + data.height;
        goBackBtn();
    });
}