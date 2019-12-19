// function that handles json storage
function updateJson(filename, destinationFolder, detectionFrame)
{
	const fs = require('fs');
	const file = destinationFolder+"/detect.json";
	if (!fs.existsSync(file)) {
		const base = {
			dati:[]
		}
		fs.writeFileSync(file, JSON.stringify(base))
	}
	
	const jsonData = {
		file: filename,
		data: [detectionFrame.detection],
		width: detectionFrame.width,
		height: detectionFrame.height,
		mainColor: detectionFrame.mainColor
	};
		
	let d = fs.readFileSync(file, 'utf-8') 
	let arrayOfObjects = JSON.parse(d);
	
	let test;
	if (arrayOfObjects.dati.length!=0)
	{
		test = arrayOfObjects.dati.filter(
			function(x){ 
				return x.file == filename; 
			}
		)
	}
	
	if (typeof(test)=='undefined' || test.length==0)
	{
		arrayOfObjects.dati.push(jsonData)
	}
	else
	{
		test[0].data.push(detectionFrame.detection);
	}
	fs.writeFileSync(file, JSON.stringify(arrayOfObjects), 'utf-8');
}

module.exports = { 
	updateJson
}