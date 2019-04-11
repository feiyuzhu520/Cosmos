
var files
var output = "";
var Rotated=false;
//var DisplayCanvas = document.createElement("canvas");
var DisplayCanvas = document.getElementById("DisplayCanvas");
//var DisplayImage = document.getElementById("DisplayImage");
var DisplayImage = new Image();




function FileSelect(evt) {
	files = evt.target.files; // FileList object
	//console.log(files);
	// files is a FileList of File objects. List some properties.
	CurrentIndex = 0;
	output = "";
	for (var i = 0, f; f = files[i]; i++) {
		output = output + '<strong>' + escape(f.name) + '</strong><br>';

	}
	document.getElementById('list').innerHTML = output;



}

document.getElementById('inputfile').addEventListener('change', FileSelect, false);





var reader = new FileReader();
var JPEG_reader = new FileReader();
var OriginalImage = new Image();
//var TempImage = new Image();





function GetImageSize(Image) {


	var allMetaData = Image.exifdata;
	var Orientation = allMetaData.Orientation || 0;

	var allMetaDataSpan = document.getElementById("allMetaDataSpan");
	if (Orientation > 5 && Orientation < 9) {
		allMetaDataSpan.innerHTML = "ImageWidth: " + Image.height + "&emsp;"
			+ "ImageHeight: " + Image.width + "&emsp;"
			+ "Orientation: " + Orientation;
		console.log("flipped");

	}
	else {
		allMetaDataSpan.innerHTML = "ImageWidth: " + Image.width + "&emsp;"
			+ "ImageHeight: " + Image.height + "&emsp;"
			+ "Orientation: " + Orientation;

	}
	console.log(Orientation);

}

function imageRotate(Image1, Image2, Flag = 0) {


	var width = Image1.width;
	var height = Image1.height;
	var srcOrientation = Image1.exifdata.Orientation || 0;
	var ctx = DisplayCanvas.getContext("2d");


	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, DisplayCanvas.width, DisplayCanvas.height);

	if (4 < srcOrientation && srcOrientation < 9) {
		DisplayCanvas.width = height;
		DisplayCanvas.height = width;
		Rotated=true;
	}
	else {
		DisplayCanvas.width = width;
		DisplayCanvas.height = height;
	}
	//console.log(srcOrientation);

	// transform context before drawing image

	
	switch (srcOrientation) {
		case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
		case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
		case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
		case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
		case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
		case 7: ctx.transform(0, -1, -1, 0, height, width); break;
		case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
		default: break;
	}

	// draw image
	ctx.drawImage(Image1, 0, 0);


	console.log(DisplayCanvas.width);
	console.log(DisplayCanvas.height);

	if (Flag > 0) {
		document.getElementById('X_min').value = 0;
		document.getElementById('X_max').value = DisplayCanvas.width;
		document.getElementById('Y_min').value = 0;
		document.getElementById('Y_max').value = DisplayCanvas.height;
	}

	Image2.src = DisplayCanvas.toDataURL();
	//  OriginalImage.src = DisplayCanvas.toDataURL();	
	//	DisplayImage.src=OriginalImage.src;
}


function OriginalImageFunc() {

	GetImageSize(this);
	imageRotate(this, DisplayImage, 1);
}




DisplayImage.onload = function () {

	console.log(this.width);
	console.log(this.height);


}
OriginalImage.onload = OriginalImageFunc;

//OriginalImage.src=DisplayImage.src;

reader.onload = function () {


	OriginalImage.src = reader.result;

	//console.log(document.getElementById('Rotation_checkBox').checked);

}

JPEG_reader.onload = function () {

	var data = findEXIFinJPEG(this.result);
	console.log(data);
	OriginalImage.exifdata = data || {};

	reader.readAsDataURL(this.file);
}

var CurrentIndex = 0;

function Display() {

	var f = files[CurrentIndex];

	//var checkbox=document.getElementById("Rotation_checkBox");

	JPEG_reader.file = f;
	JPEG_reader.readAsArrayBuffer(f);


}

function Previous() {

	CurrentIndex--;
	if (CurrentIndex < 0) {

		CurrentIndex = files.length - 1;
	}
	Display();
}

function Next() {
	CurrentIndex++;
	if (CurrentIndex > files.length - 1) {

		CurrentIndex = 1;
	}

	Display();
}


//var DisplayCanvas = document.createElement("canvas");
//var CropImage = new Image();


var Data_old;
function imageCrop() {

	//console.log(DisplayImage);
	//var DisplayImage=document.getElementById("DisplayImage");

//	var width = DisplayImage.naturalWidth;
//	var height = DisplayImage.naturalHeight;
//	canvas.width = width;
//	DisplayCanvas.height = height;
//	console.log(width);
//	console.log(height);
	var ctx = DisplayCanvas.getContext("2d");
//	ctx.drawImage(DisplayImage, 0, 0);

	width=DisplayCanvas.width;
	height=DisplayCanvas.height;


	var x1 = document.getElementById('X_min').value;
	var x2 = document.getElementById('X_max').value;
	var y1 = document.getElementById('Y_min').value;
	var y2 = document.getElementById('Y_max').value;



	x1 = parseInt(x1);
	x2 = parseInt(x2);
	y1 = parseInt(y1);
	y2 = parseInt(y2);

	x1 = Math.max(x1, 0); x1 = Math.min(x1, width);
	x2 = Math.max(x2, 0); x2 = Math.min(x2, width);
	y1 = Math.max(y1, 0); y1 = Math.min(y1, height);
	y2 = Math.max(y2, 0); y2 = Math.min(y2, height);


	console.log(x1, x2, y1, y2);

	document.getElementById('X_min').value = x1;
	document.getElementById('X_max').value = x2;
	document.getElementById('Y_min').value = y1;
	document.getElementById('Y_max').value = y2;

	var map = ctx.getImageData(0, 0, width, height);
	var imdata = map.data;
	Data_old=imdata.slice();
	//console.log(Data_old);
	var X;
	var Y;
	for (var p = 0, len = imdata.length; p < len; p += 4) {

		Y=Math.floor(p/4/width);
		X=(p/4)%width;
		
		if(X<x1 || X>x2 || Y<y1 || Y>y2){
			imdata[p+3]=0.2*255;
		}
		else{
			imdata[p+3]=255;
		}
	}


	ctx.putImageData(map, 0, 0);


	DisplayImage.src = DisplayCanvas.toDataURL();


	//CropImage.src = DisplayImage.src;

	//console.log(CropImage);


	//automaticly set binarize parameters

	document.getElementById('Hue_min').value = 0;
	document.getElementById('Hue_max').value = 0.5;
	document.getElementById('Saturation_min').value = 0.1;
	document.getElementById('Saturation_max').value = 1.0;
	document.getElementById('Value_min').value = 0.1;
	document.getElementById('Value_max').value = 0.8;



}


//var BinaryImage = new Image();
function rgbToHsv(r, g, b) {

    r = Math.min(r, 255);
    g = Math.min(g, 255);
    b = Math.min(b, 255);

    var Cmax = Math.max(r, g, b), Cmin = Math.min(r, g, b);
    var h, s, v = Cmax/255;

    var d = Cmax - Cmin;
    s = Cmax === 0 ? 0 : d / Cmax;

    if(Cmax == Cmin) {
        h = 0; // achromatic
    }
    else {
        switch(Cmax) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

function imageBinarize() {
	//var DisplayCanvas = document.createElement("canvas");

	//DisplayCanvas.width = OriginalImage.width;
	//DisplayCanvas.height = OriginalImage.height;


	var ctx = DisplayCanvas.getContext("2d");
	//ctx.drawImage(CropImage, 0, 0);

	var map = ctx.getImageData(0, 0, DisplayCanvas.width, DisplayCanvas.height);
	var imdata = map.data;

	var r, g, b;

	var h1 = document.getElementById('Hue_min').value;
	var h2 = document.getElementById('Hue_max').value;
	var s1 = document.getElementById('Saturation_min').value;
	var s2 = document.getElementById('Saturation_max').value;
	var v1 = document.getElementById('Value_min').value;
	var v2 = document.getElementById('Value_max').value;





	h1 = Number(h1);
	h2 = Number(h2);
	s1 = Number(s1);
	s2 = Number(s2);
	v1 = Number(v1);
	v2 = Number(v2);


	console.log(h1,h2,s1,s2,v1,v2);

	var HSV;
	//console.log(Data_old);

	for (var p = 0, len = imdata.length; p < len; p += 4) {


//			imdata[p]=Data_old[p];
//			imdata[p+1]=Data_old[p+1];
//			imdata[p+2]=Data_old[p+2];

		r = Data_old[p]
		g = Data_old[p + 1];
		b = Data_old[p + 2];

		HSV=rgbToHsv(r,g,b);

		h=HSV.h;
		s=HSV.s;
		v=HSV.v;
		//console.log(h,s,v);
		if (!((h >= h1 && h <= h2) && (s >= s1 && s <= s2) && (v >= v1 && v <= v2) )) {

			// white = land
			imdata[p] = 0;
			imdata[p + 1] = 0;
			imdata[p + 2] = 0;
		}
		else{
			imdata[p]=Data_old[p];
			imdata[p+1]=Data_old[p+1];
			imdata[p+2]=Data_old[p+2];
		}
	}
	ctx.putImageData(map, 0, 0);
	//var DisplayImage = document.getElementById('DisplayImage');


	DisplayImage.src = DisplayCanvas.toDataURL();

	//BinaryImage.src = DisplayImage.src;
	//console.log(BinaryImage);

}


var Text;

//function getColorIndicesForCoord(x, y, width) {
//var red = y * (width * 4) + x * 4;
//return [red, red + 1, red + 2, red + 3];
//}

function imagePixel() {
	//var DisplayCanvas = document.createElement("canvas");

	//DisplayCanvas.width = OriginalImage.width;
	//DisplayCanvas.height = OriginalImage.height;
	var ctx = DisplayCanvas.getContext("2d");
	//ctx.drawImage(DisplayImage, 0, 0);

		var x1 = document.getElementById('X_min').value;
		var x2 = document.getElementById('X_max').value;
		var y1 = document.getElementById('Y_min').value;
		var y2 = document.getElementById('Y_max').value;

		x1 = parseInt(x1);
		x2 = parseInt(x2);
		y1 = parseInt(y1);
		y2 = parseInt(y2);

		console.log(x1, x2, y1, y2);

		var map = ctx.getImageData(x1, y1, x2, y2);
		var imdata = map.data;
	//var SumR=0;
	var SumG = 0;
	//var SumB=0;

	var Count = 0;
	//var CountR=0;
	//var CountG=0;
	//var CountB=0;

	var Width = 0;
	var Height = 0;
	var ColumnSum;
	var RowSum;
	var greenIndex;



	var h1 = document.getElementById('Hue_min').value;
	var h2 = document.getElementById('Hue_max').value;
	var s1 = document.getElementById('Saturation_min').value;
	var s2 = document.getElementById('Saturation_max').value;
	var v1 = document.getElementById('Value_min').value;
	var v2 = document.getElementById('Value_max').value;





	h1 = Number(h1);
	h2 = Number(h2);
	s1 = Number(s1);
	s2 = Number(s2);
	v1 = Number(v1);
	v2 = Number(v2);


	console.log(h1,h2,s1,s2,v1,v2);

	var HSV;
	for (var p = 0, len = imdata.length; p < len; p += 4) {
		r = imdata[p]
		g = imdata[p + 1];
		b = imdata[p + 2];

		HSV=rgbToHsv(r,g,b);

		h=HSV.h;
		s=HSV.s;
		v=HSV.v;
		//console.log(h,s,v);
		if ((h >= h1 && h <= h2) && (s >= s1 && s <= s2) && (v >= v1 && v <= v2) ) {
				// white = land
				if (g > 0) {

					SumG += g;
					Count += 1;
				}
		}
	}


		var Width = 0;
		var Height = 0;
		var ColumnSum;
		var RowSum;
		var greenIndex;
		for (var x = 0; x < x2 - x1; x++) {
			ColumnSum = 0;
			for (var y = 0; y < y2 - y1; y++) {
				//coords=getColorIndicesForCoord(x,y,DisplayCanvas.width);
				//greenIndex=coords[1];
				greenIndex = y * (x2 - x1) * 4 + x * 4 + 1;
				ColumnSum += imdata[greenIndex];

			}

			if (ColumnSum > 0) {
				Width += 1;
			}

		}

		for (var y = 0; y < y2 - y1; y++) {
			RowSum = 0;
			for (var x = 0; x < x2 - x1; x++) {
				//coords=getColorIndicesForCoord(x,y,DisplayCanvas.width);
				//greenIndex=coords[1];
				greenIndex = y * (x2 - x1) * 4 + x * 4 + 1;
				RowSum += imdata[greenIndex];
			}

			if (RowSum > 0) {
				Height += 1;
			}

		}





	/////////////////////Display results
	var f = files[CurrentIndex];
	var pixelSum = "&emsp;PixelSum: &emsp;" + SumG + "<br>";
	var pixelCount = "&emsp;PixelCount: &emsp;" + Count + "<br>";
	var pixelWidth = "&emsp;Width: &emsp;" + Width + "<br>";
	var pixelHeight = "&emsp;Height: &emsp;" + Height + "<br>";
	document.getElementById('pixelValues').innerHTML = "<b>SINGLE MODE</b><br>" + f.name + "<br>" + pixelSum + pixelCount + pixelWidth + pixelHeight;

	Text = "";
	Text = Text + "Filename,PixelSum,PixelCount,Width,Height\n";
	Text = Text + f.name + "," + SumG + "," + Count + "," + Width + "," + Height + "\n";
}


//Download Text file

function TextFile(text) {
	var data = new Blob([text], { type: 'text/plain' });

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	// (textFile !== null) {
	//window.URL.revokeObjectURL(textFile);
	//}

	var textFile = window.URL.createObjectURL(data);

	return textFile;
}

function DownloadData() {

	var textFile = TextFile(Text);

	//var Button= document.getElementById('Download');

	var f = files[CurrentIndex];
	var FileName = f.name;
	FileName = FileName.substring(0, FileName.lastIndexOf('.'));

	var downloadLink = document.createElement("a");
	downloadLink.download = FileName + ".csv";
	downloadLink.innerHTML = "Download File";
	//downloadLink.href = textFile;
	downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(Text));

	//downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}



function BatchImagePixel() {

	var BatchIndex = 0;
	var BatchReader = new FileReader();
	var JPEG_BatchReader = new FileReader();
	var BatchImage1 = new Image();
	var BatchImage2 = new Image();



	BatchImage1.onload = function () {

		GetImageSize(this);
		imageRotate(this, BatchImage2);
	}


	BatchReader.onload = function () {
		BatchImage1.src = BatchReader.result;

	}

	JPEG_BatchReader.onload = function () {

		var data = findEXIFinJPEG(this.result);
		//console.log(data);
		BatchImage1.exifdata = data || {};

		BatchReader.readAsDataURL(this.file);
	}

	BatchImage2.onload = function () {

		
//		var width = BatchImage2.width;
//		var height = BatchImage2.height;
//		BatchCanvas.width = width;
//		BatchCanvas.height = height;
//		console.log(width);
//		console.log(height);
		var ctx = DisplayCanvas.getContext("2d");
		//ctx.drawImage(BatchImage2, 0, 0);



		var x1 = document.getElementById('X_min').value;
		var x2 = document.getElementById('X_max').value;
		var y1 = document.getElementById('Y_min').value;
		var y2 = document.getElementById('Y_max').value;

		x1 = parseInt(x1);
		x2 = parseInt(x2);
		y1 = parseInt(y1);
		y2 = parseInt(y2);

		console.log(x1, x2, y1, y2);

		var map = ctx.getImageData(x1, y1, x2, y2);
		var imdata = map.data;


		var r, g, b;
		var BatchSumG = 0;
		var BatchCount = 0;



	var h1 = document.getElementById('Hue_min').value;
	var h2 = document.getElementById('Hue_max').value;
	var s1 = document.getElementById('Saturation_min').value;
	var s2 = document.getElementById('Saturation_max').value;
	var v1 = document.getElementById('Value_min').value;
	var v2 = document.getElementById('Value_max').value;





	h1 = Number(h1);
	h2 = Number(h2);
	s1 = Number(s1);
	s2 = Number(s2);
	v1 = Number(v1);
	v2 = Number(v2);


	console.log(h1,h2,s1,s2,v1,v2);

	var HSV;
	for (var p = 0, len = imdata.length; p < len; p += 4) {
		r = imdata[p]
		g = imdata[p + 1];
		b = imdata[p + 2];

		HSV=rgbToHsv(r,g,b);

		h=HSV.h;
		s=HSV.s;
		v=HSV.v;
		//console.log(h,s,v);
		if ((h >= h1 && h <= h2) && (s >= s1 && s <= s2) && (v >= v1 && v <= v2) ) 

		{
						// white = land
				if (g > 0) {

					BatchSumG += g;
					BatchCount += 1;
				}
		}
	}


		var Width = 0;
		var Height = 0;
		var ColumnSum;
		var RowSum;
		var greenIndex;
		for (var x = 0; x < x2 - x1; x++) {
			ColumnSum = 0;
			for (var y = 0; y < y2 - y1; y++) {
				//coords=getColorIndicesForCoord(x,y,DisplayCanvas.width);
				//greenIndex=coords[1];
				greenIndex = y * (x2 - x1) * 4 + x * 4 + 1;
				ColumnSum += imdata[greenIndex];

			}

			if (ColumnSum > 0) {
				Width += 1;
			}

		}

		for (var y = 0; y < y2 - y1; y++) {
			RowSum = 0;
			for (var x = 0; x < x2 - x1; x++) {
				//coords=getColorIndicesForCoord(x,y,DisplayCanvas.width);
				//greenIndex=coords[1];
				greenIndex = y * (x2 - x1) * 4 + x * 4 + 1;
				RowSum += imdata[greenIndex];
			}

			if (RowSum > 0) {
				Height += 1;
			}

		}



		var f = files[BatchIndex];
		var pixelSum = "&emsp;PixelSum: &emsp;" + BatchSumG + "<br>";
		var pixelCount = "&emsp;PixelCount: &emsp;" + BatchCount + "<br>";
		var pixelWidth = "&emsp;Width: &emsp;" + Width + "<br>";
		var pixelHeight = "&emsp;Height: &emsp;" + Height + "<br>";
		document.getElementById('pixelValues').innerHTML = document.getElementById('pixelValues').innerHTML + f.name + "<br>" + pixelSum + pixelCount + pixelWidth + pixelHeight;

		Text = Text + f.name + "," + BatchSumG + "," + BatchCount + "," + Width + "," + Height + "\n";

		console.log(BatchIndex);
		BatchIndex += 1;
		if (BatchIndex < files.length) {

			/* 			console.log(BatchIndex);
						f=files[BatchIndex];
						//console.log(f);
						BatchReader.readAsDataURL(f); */
			f = files[BatchIndex];
			//BatchReader.readAsDataURL(f);

			JPEG_BatchReader.file = f;
			JPEG_BatchReader.readAsArrayBuffer(f);

		}
	}





	document.getElementById('pixelValues').innerHTML = "<b>BATCH MODE</b><br>";

	Text = "";
	//Text=Text+"Filename,PixelSum,PixelCount\n";
	Text = Text + "Filename,PixelSum,PixelCount,Width,Height\n";

	//var f;

	f = files[BatchIndex];
	//BatchReader.readAsDataURL(f);

	JPEG_BatchReader.file = f;
	JPEG_BatchReader.readAsArrayBuffer(f);



}

