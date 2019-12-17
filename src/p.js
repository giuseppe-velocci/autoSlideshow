
const fs = require('fs')

function deleteCategoriesSync(){
    const directory = `${__dirname}\\categories\\`;
    const files = fs.readdirSync(directory);
    let path;
    console.log(files)
    console.log(files.length)
    try{
        files.forEach(file => {
            path = directory+file
            console.log(path)
            if(!fs.lstatSync(path).isDirectory()){
                fs.unlinkSync(path)
            }else{
                const curFiles = fs.readdirSync(path)
                curFiles.length===0 ? fs.rmdirSync(path) : curFiles.forEach(curFile => {fs.unlinkSync(path+"\\"+curFile)})
            }
        });
        console.log("Successful, all files has been deleted");
        // then cycle through folders and delte them
        files.forEach(file => {
            path = directory+file;
            fs.rmdirSync(path);
        });
    }catch (err) {console.log(err)}
    
}

deleteCategoriesSync();