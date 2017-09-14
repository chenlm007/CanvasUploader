/*
Author: Gavin Youker
Date:   5/2/17
File:   /scripts/upload.js
Info:   Pure JavaScript upload script.
        The script convers the user selected
		image into a canvas element, and then 
		sent via AJAX in base64.
*/

// Define global variables
var _URL = window.URL || window.webkitURL;
var defaultImg = document.getElementById("filePreview").src;

// Function to load the file.
function getUpload() {
	// Reset the uploader.
	document.getElementById("filePreview").src = defaultImg;
	document.getElementById("fileName").value = null;
	document.getElementById("fileInput").files[0] = null;
	
	// Define local variables.
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
				// Set the minimum amd maximum image dimensions.
				var width_min = 200;
				var height_min = 200;
				
				var width_max = 400;
				var height_max = 400;
				
				// Resize image to proper constraints.
				if(img.width >= width_min || img.height >= height_min) {
					if(img.width > width_max  || img.height > height_max) {
						switch(true) {
							case (img.width > img.height):
								var ratio = img.height / img.width;
							
								img.width = width_max;
								img.height = height_max * ratio;
								break;
							case (img.height > img.width):
								var ratio = img.width / img.height;
							
								img.height = height_max;
								img.width = width_max * ratio;
								break;
							case (img.width == img.height):
								img.width = width_max;
								img.height = height_max;
								break;								
						}
					} else {
						img.width = img.width;
						img.height = img.height;						
					}
					
					// Create new canvas and draw image.
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					
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
					
					document.getElementById("filePreview").src = dataURL;
					document.getElementById("fileName").value = fileName;
				
				} else {
					alert ("Upload failed. File dimensions too small." + "\n" + "The minimum image dimensions are 200 x 200 pixels.")
				}
			};
			img.src = _URL.createObjectURL(file);
			
		} else {
			alert("Upload failed. Cannot read the file." + "\n" + "The uploaded file must be an image.")
		}
	});
	read.readAsArrayBuffer(file);
}

// Function to send the file.
function sendUpload() {
	if(document.getElementById("filePreview").src != defaultImg) {
		// Define local variables.
		dataURL = document.getElementById("filePreview").src;
		fileName = document.getElementById("fileName").value;
		
		// Send AJAX request.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (request.readyState == 4) {
				switch(request.status) {
					case 200:
						console.log("Upload succeeded.");
						break;
					case 404:
						console.log("Upload failed.");
						alert("Upload failed. The uploader script cannot be found." + "\n" + "Please contact your administrator.");
						break;
					case 500:
						console.log("Upload failed.");
						alert("Upload failed. An error has occured." + "\n" + "Please try again.");
						break;
				}
			}
		};
		request.open("POST", "functions/upload.php", true);
		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send("DataURL=" + encodeURIComponent(dataURL) + "&FileName=" + fileName);
	}
}