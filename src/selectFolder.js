const testFolder =  __dirname+'/categories/';
const fs = require('fs');
let list= `Select category <select style='background-color: black; color: #808080;' id='scelta'>`;
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
	  if(fs.lstatSync(testFolder + file).isDirectory())
		list = list + ` <option value= "${file}"> ${file} </option>`
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