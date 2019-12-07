const fs = require('fs');

//archive path - archive is the folder that contain images to be analized
const arPath = __dirname + '\\archive'
// origin destination path - pages is the folder that contain objName folders with images already sorted
let dPath = __dirname + '\\categories\\'

function destinationFolder(objName){
    objName=objName.replace(/ /,'-') //replace spaces with dashes
    const path = dPath+objName; //create final destination path
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    return path
}

function copyImg(filePath, destinationPath){//paths must contain filename
    fs.copyFile(filePath, destinationPath, (err) => {
        if (fs.existsSync(destinationPath)){
            return false
        } else if (err) {
            console.log(err)
            return false
        }
        return true
    });
}

module.exports = { 
	destinationFolder, copyImg
}

/*
// test
const filePath = 'D:\\giuse\\Documents\\ITS_2018_20\\NodeJs\\testslideshow\\tensorflow-img\\finalNodePrj\\src\\ts-img-action.js';
const dest = destinationFolder('dog men');
console.log(copyImg(filePath, dest + '\\ts-img-action.js'));
*/
