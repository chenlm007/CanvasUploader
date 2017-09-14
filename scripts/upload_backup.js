/*
Author: Gavin Youker
Date:   5/2/17
File:   upload.js
Info:   Pure JavaScript upload script.
        The script convers the user selected
		image into a canvas element, and then 
		sent to a backend script via AJAX in base64.
*/

var _URL = window.URL || window.webkitURL;
var defaultImg = document.getElementById("filePreview").src;

document.getElementById("fileInput").addEventListener("change", function() {
	// Reset the uploader.
	document.getElementById("filePreview").src = defaultImg;
	document.getElementById("fileName").value = null;
	document.getElementById("fileInput").files[0] = null;
	
	// Define global variables.
	var file = document.getElementById("fileInput").files[0];
	var hexAllowers = ["FF D8 FF", "89 50 4E", "47 49 46"];
	var fileValidation = false;
	
	var read = new FileReader();
	read.addEventListener('load', function () {
		// Check file for proper HEX signature.
		var hex = new Uint8Array(this.result);
		var hexSignature = (hex[0].toString(16) + " " + hex[1].toString(16) + " " + hex[2].toString(16)).toUpperCase();

		for(var i = 0; i < 3; i++) {
			if(hexAllowers[i] == hexSignature) {
				fileValidation = true;
			}
		}
		
		// Being working with upload image.
		if(file.type.match("image.*") && fileValidation == true) {
			// Create new image.
			var img = new Image();
			img.onload = function() {
				// Create new canvas on image load.
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				
				// Resize image to proper constraints.
				if(img.width >= 200 || img.height >= 200) {
					if(img.width > 400  || img.height > 400) {
						switch(true) {
							case (img.width > img.height):
								var ratio = img.height / img.width;
							
								img.width = 400;
								img.height = 400 * ratio;
								
								break;
							case (img.height > img.width):
								var ratio = img.width / img.height;
							
								img.height = 400;
								img.width = 400 * ratio;
								
								break;
							case (img.width == img.height):
								img.width = 400;
								img.height = 400;

								break;								
						}
					} else {
						img.width = img.width;
						img.height = img.height;						
					}
					
					// Draw out the canvas.
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0, img.width, img.height);
					
					// Convert the image to black and white.
					/*var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var data = imageData.data;
					for(var i = 0; i < data.length; i += 4) {
						data[i + 0] = data[i + 1] = data[i + 2] = (data[i] + data[i + 1] + data[i + 2]) / 3;
					}
					ctx.putImageData(imageData, 0, 0);

					var grayImg = new Image();
					grayImg.onload = function() {
						document.body.appendChild(aImg);
						document.body.appendChild(grayImg);
					}*/
					
					// Convert the canvas to Base64 and create unique file ID.
					var dataURL = canvas.toDataURL("image/png");
					var fileName = file.name.replace(/\.[^/.]+$/, "") + "_" + Date.now() + ".png";
					
					// Create AJAX request.
					var request = new XMLHttpRequest();
					request.onreadystatechange = function () {
						if (request.readyState == 4) {
							switch(request.status) {
								case 200:
									document.getElementById("filePreview").src = dataURL;
									// document.getElementById("fileName").value = this.responseText;
									document.getElementById("fileName").value = fileName;
									break;
								case 404:
									alert("Upload failed. The uploader script cannot be found." + "\n" + "Please contact your administrator.");
									break;
								case 500:
									alert("Upload failed. An error has occured." + "\n" + "Please try again.");
									break;
							}
						}
					};
					request.open("POST", "upload.asp", true);
					request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					request.send("DataURL=" + encodeURIComponent(dataURL) + "&FileName=" + fileName);
				
				} else {
					alert ("Upload failed. File dimensions too small." + "\n" + "The minimum image dimensions are 200 x 200.")
					return;
				}
			};
			img.src = _URL.createObjectURL(file);
			
		} else {
			alert("Upload failed. Cannot read the file." + "\n" + "The uploaded file must be an image.")
		}
	});
	read.readAsArrayBuffer(file);
});