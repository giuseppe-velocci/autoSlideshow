// script for animation.html that handles browser animation for the images basing on .json file inside the given folder
$(document).ready(function() {   

	let interestArea = require ("./interestArea.js");
	let folder = "./categories/"+ sessionStorage.getItem("animationFolder");
	let end = "<div id='end' style='display: none; font-size: xx-large; color: #808080;'>THE END </div>";

	const bboxInterval = 1660;

	$.getJSON(folder + "/detect.json", function(r){
		let i=0;
		presentation(i, r);	
		let animation = setInterval(() => {
			i++;
			if (i == r.dati.length) {
				clearInterval(animation);
				$("#foto").hide();
				$("#colorbar").css('color', '#808080');
				$("#end").fadeIn(10000);
				setTimeout(()=>{
					$("#end").hide();
				}, 10000)
			}
			else {
				presentation(i, r);
			}
		},9500);
    });
	
	function presentation(i, r)
	{
		let img = "<div id='divfoto' style='background:black; overflow:hidden; position:absolute; width:" + r.dati[i].width + "px; height:" + r.dati[i].height +"px'>";
		img = img + "<img id='foto' src=" + folder + "/" + r.dati[i].file + " style='position:relative;' >"
		img = img + end;
		const o = r.dati[i];
		for (let k=0; k < o.data.length; k++) {
			console.log(o.data[k]);
			img += "<div class='bbox' style='position:absolute; border:solid; border-color:rgb("
			+ (+255 -o.data[k].objColor.r) + "," + (+255 -o.data[k].objColor.g) + "," + (+255 -o.data[k].objColor.b) 
			+"); border-width:3px;"
			+ "left:"+ o.data[k].bbox[0]
			+ "px; top:"+ o.data[k].bbox[1]
			+"px; width:"+ o.data[k].bbox[2]
			+"px; height:"+ o.data[k].bbox[3]
			+"px; "
			+"px; z-index:9999;'></div>";
		}
		img += "</div>";

	$("#colorbar").css('color', `rgb(${r.dati[i].mainColor.r},${r.dati[i].mainColor.g},${r.dati[i].mainColor.b})`);
	//	$("#colorbar").css('color', `rgb(${r.dati[i].data[0].objColor.r},${r.dati[i].data[0].objColor.g},${r.dati[i].data[0].objColor.b})`);

		$("#animationDiv").html(img);

		$(".bbox").animate({'opacity': '0'}, bboxInterval);
		
		setTimeout(() => {
		let p = interestArea.interestArea(r.dati[i].data, r.dati[i].width, r.dati[i].height);
		$("#foto").animate(
			//left: -left, top: -up
			{'left': `-${p.left}px`, 'top': `-${p.up}px`}, 3000
		);
		$("#divfoto").animate(
			//width: right-left, height: down-up
			{'width':`${(r.dati[i].width-p.left-p.right)}px`, 'height': `${(r.dati[i].height-p.up-p.down)}px`
			, 'left': `${(window.innerWidth - (r.dati[i].width-p.left-p.right))/2}px`
		}, 3000
		);
		$("#foto").animate(
			//width: w+(right-left), height: h+(down-up)
			{'width':`${(r.dati[i].width*2)}px`, 'height': `${(r.dati[i].height*2)}px`, 'left': `-${p.left*2}px`, 'top': `-${p.up*2}px`}, 3000
		);
		$("#divfoto").animate(
			//width: w, height: h
			{'width':`${(r.dati[i].width-p.left-p.right)*2}px`, 'height': `${(r.dati[i].height-p.up-p.down)*2}px`
			, 'left': `${(window.innerWidth /2 -(r.dati[i].width-p.left-p.right))}px`
			}, 3000
		);
	}, bboxInterval);
	}
}); 