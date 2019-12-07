
$(document).ready(function() {   
	
	let interestArea = require ("./interestArea.js");
	let folder = "./categories/"+ sessionStorage.getItem("animationFolder");
	
	$.getJSON(folder + "/detect.json", function(r){
		presentation(0, r);	
		let i=1
		let animation = setInterval(() => {
			presentation(i, r)
			i++;
			if (i == r.dati.length) clearInterval(animation);
		},10000);
    });
	
	function presentation(i, r)
	{
		let img = "<div id='divfoto' style='background:white; overflow:hidden; position:absolute; width:" + r.dati[i].width + "px; height:" + r.dati[i].height +"px'>";
		img = img + "<img id='foto' src=" + folder + "/" + r.dati[i].file + " style='position:relative;' ></div>"
		
		
		$("#animationDiv").html(img);
		
		let p = interestArea.interestArea(r.dati[i].data, r.dati[i].width, r.dati[i].height);
		console.log(p);
		$("#foto").animate(
			//left: -left, top: -up
			{'left': `-${p.left}px`, 'top': `-${p.up}px`}, 3000
		);
		$("#divfoto").animate(
			//width: right-left, height: down-up
			{'width':`${(r.dati[i].width-p.left-p.right)}px`, 'height': `${(r.dati[i].height-p.up-p.down)}px`}, 3000
		);
		$("#foto").animate(
			//width: w+(right-left), height: h+(down-up)
			{'width':`${(r.dati[i].width+(p.right+p.left))}px`, 'height': `${(r.dati[i].height+(p.down+p.up))}px` }, 3000
		);
		$("#divfoto").animate(
			//width: w, height: h
			{'width':`${r.dati[i].width}px`, 'height': `${r.dati[i].height}px` }, 3000
		);
	}
}); 