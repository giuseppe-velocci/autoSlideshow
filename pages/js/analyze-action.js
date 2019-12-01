const fs = require('fs');

const resElement = document.querySelector('.res');
const progressElement = document.querySelector('#progress');
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
const validImgsNum = fileList.img.length;

// if no valid files were found: stop
console.log(fileList.img);
if (validImgsNum < 1) {
    resElement.innerHTML = 'No valid images found inside the given folder.';
    goBackBtn();
    throw new Error();
}

// if everything is ok: start processing data
const numCPUs = require('os').cpus().length;
(async function (){
    const result = [];
    if (validImgsNum > 1) {
        if (numCPUs <= validImgsNum) {
            // .. here using multi-processes
        }
    // single process handeling
    } else {
        progressElement.innerHTML = `analyzing: ${fileList.img[0]}`;
        const resDetection = await detect(folder + '/'+ fileList.img[0]); 
        result.push(resDetection);
    }
})().then((data) =>{
    resElement.innerHTML = '';
    progressElement.innerHTML = 'DONE!';
    goBackBtn();
});
