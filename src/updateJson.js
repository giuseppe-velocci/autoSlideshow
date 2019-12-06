function updateJson(filename, destinationFolder, detectionFrame)
{
	const fs = require('fs');
	const file = destinationFolder+"/detect.json";
	if (!fs.existsSync(file)) {
		const base = {
			dati:[]
		}
		fs.writeFile(file, JSON.stringify(base), (err) => {
			if (err) throw err
		})
	}
	
	const jsonData = {
		file:filename,
		data: [detectionFrame.detection],
		width: detectionFrame.width,
		height: detectionFrame.height
	};
		
	fs.readFile(file, 'utf-8', function(err, data) {
		if (err) throw err
		let arrayOfObjects = JSON.parse(data)
		
		let i=0;
		if (arrayOfObjects.dati.length!=0)
		{
			while(arrayOfObjects.dati[i].file!= filename && i!=arrayOfObjects.dati.length)
			{
				console.log(arrayOfObjects.dati[i].file);
				i++;
			}
		
		}
		
		if (i==arrayOfObjects.dati.length)
		{
			arrayOfObjects.dati.push(jsonData)
		}
		else
		{
			arrayOfObjects.dati[i].data.push(detectionFrame.detection);
		}
		fs.writeFile(file, JSON.stringify(arrayOfObjects), 'utf-8', (err) =>  {
			if (err) throw err
			console.log('Done!')
			console.log(arrayOfObjects);
		})
	})
}

module.exports = { 
	updateJson
}
//updateJson("NomeImmagine.jpg", __dirname, {test: "test"})