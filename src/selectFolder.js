const testFolder =  __dirname+'/categories/';
const fs = require('fs');
let list= `Select category <select style='background-color: black; color: #808080;' id='scelta'>`;
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
	  if(fs.lstatSync(testFolder + file).isDirectory())
		list = list + `<option value= "${file}"> ${file} </option>`
	});
list = list + "</select>";
document.getElementById("folder").innerHTML = list;
});


function save()
{
	let sceltaIndex = document.getElementById("scelta");
	sessionStorage.setItem("animationFolder", sceltaIndex[sceltaIndex.selectedIndex].value);
	document.getElementById("animazione").submit();
}


function deleteCategoriesSync(){
    const directory = `${__dirname}\\categories\\`;
    const files = fs.readdirSync(directory);
    let path;
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
        // then cycle through folders and delte them
        files.forEach(file => {
            path = directory+file;
            fs.rmdirSync(path);
		});
		console.log("Successful, all files has been deleted");
	}catch (err) {console.log(err)} 

	// empty the select element
	document.querySelector('#scelta').options.length = 0;
}
