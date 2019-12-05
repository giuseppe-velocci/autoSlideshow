//ricevo in input il vettore con gli oggetti trovati (ovvero il risultato di tensorFlow) e le dimensioni dell'immagine
function interestArea(a, w, h)
{
	const x=[];
	const y=[];
	for(i=0; i<a.length; i++)
	{
		let c=a[i].bbox.slice(0,a[i].bbox.length);
		if (c.length != 0)
		{
			x.push(c[0]);
			x.push(c[0]+c[2]);
			y.push(c[1]);
			y.push(c[1]+c[3]);
		}
	}
	let xmin = Math.min.apply(null, x);
	let xmax = Math.max.apply(null, x);
	let ymin = Math.min.apply(null, y);
	let ymax = Math.max.apply(null, y);
	
	let dimension = {up: ymin, down: h-ymax, left: xmin, right: w-xmax}
//l'output è un oggetto con i dati necessari all'animazione	
	return dimension;
}