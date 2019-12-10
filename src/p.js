
const fs = require('fs')

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

deleteCategoriesSync();