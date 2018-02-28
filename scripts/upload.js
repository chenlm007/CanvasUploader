/*
Author: Gavin Youker
Date:   5/2/17
File:   /scripts/upload.js
Info:   Pure JavaScript upload script.
        The script converts the user selected
		image into a canvas element, and then 
		sent via AJAX in base64.
*/

// Function to load the file.
function getUpload() {	
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
				// Set the minimum and maximum image dimensions.
				var width_min = 200;
				var height_min = 200;
				
				var width_max = 400;
				var height_max = 400;
				
				// Resize image to proper constraints.
				if(img.width >= width_min || img.height >= height_min) {
					if(img.width > width_max  || img.height > height_max) {
						switch(true) {
							case (img.width > img.height):							
								img.width = width_max;
								img.height = height_max * (img.height / img.width;);
								break;
							case (img.height > img.width):							
								img.height = height_max;
								img.width = width_max * (img.width / img.height);
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
					
					// Convert the canvas to Base64 and create unique file ID.
					var dataURL = canvas.toDataURL("image/png");
					var fileName = file.name.replace(/\.[^.]+$|\W/g, "");
					
					document.getElementById("filePreview").src = dataURL;
					document.getElementById("fileData").value = dataURL;
					document.getElementById("fileName").value = fileName;
				} else {
					alert ("Upload failed. File dimensions too small.\nThe minimum image dimensions are 200 x 200 pixels.")
				}
			};

			var url = window.URL || window.webkitURL;
			img.src = url.createObjectURL(file);
		} else {
			alert("Upload failed. Cannot read the file.\nThe uploaded file must be an image.")
		}
	});

	read.readAsArrayBuffer(file);
}
