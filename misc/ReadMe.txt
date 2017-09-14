Author: Gavin Youker
Date:   5/2/17

Info:
This is a pure javascript uploader for images. The image is loaded into a canvas, 
and then sent to server side script (ASP or PHP) via AJAX in base64. From there, 
the data is decoded into binary and downloaded on the server.

Usage:
1. Link this script to the body of your webpage.
2. Create an input element and append onChange='getUpload()'.
3. Crate a button element and append onClick='(sendUpload)'.

Tips:
- The minimum and maximum demensions can be changed by changing the variables.
- The server side script can be changed from ASP to PHP.
- If you want just one button, place the AJAX call in the getUpload() function.
- The canvas can be modified before the base64 encoding to edit the image.
