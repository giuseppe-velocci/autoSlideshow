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

function deleteCategoriesSync(){
    const directory = `${__dirname}\\categories\\`;
    const files = fs.readdirSync(directory)
    console.log(files)
    console.log(files.length)
    try{
        files.forEach(file => {
            let path = directory+file
            console.log(path)
            if(!fs.lstatSync(path).isDirectory()){
                fs.unlinkSync(path)
            }else{
                const curFiles = fs.readdirSync(path)
                curFiles.length===0 ? fs.rmdirSync(path) : curFiles.forEach(curFile => {fs.unlinkSync(path+"\\"+curFile)})
            }
        });
        throw "Succeeful, all files has been deleted"
    }catch (err) {console.log(err)}
    
}
/*
When you use it, you must call it twice, like this:
deleteCategoriesSync();
deleteCategoriesSync();
In the first call the function deleteCategoriesSync() realize 2 gol:
1. if in categories/ there are folders with images, the function deletes those images
2. delete empty folders in categories/
In second gol the function delete the empty folders that remain in categories/
*/



module.exports = { 
	destinationFolder, copyImg
}

/*
// test
const filePath = 'D:\\giuse\\Documents\\ITS_2018_20\\NodeJs\\testslideshow\\tensorflow-img\\finalNodePrj\\src\\ts-img-action.js';
const dest = destinationFolder('dog men');
console.log(copyImg(filePath, dest + '\\ts-img-action.js'));
*/
