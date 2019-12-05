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
		  console.log('The file has been saved!')
		})
	}

	const jsonData = {
		file:filename,
		data: detectionFrame
	};
	fs.readFile(file, 'utf-8', function(err, data) {
		if (err) throw err
		let arrayOfObjects = JSON.parse(data)
		arrayOfObjects.dati.push(jsonData)
		fs.writeFile(file, JSON.stringify(arrayOfObjects), 'utf-8', (err) =>  {
			if (err) throw err
			console.log('Done!')
		})
	})
}

//updateJson("NomeImmagine.jpg", __dirname, {test: "test"})