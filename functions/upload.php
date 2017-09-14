<?php
	/*
	 Author: Gavin Youker
	 Date:   5/2/17
	 File:   /functions/upload.php
	 Info:   Gets the base64 image over POST,
	         and decodes base64 into binary.
	         Then, saves the image on the server.
	*/
	
	// Define local variables.
	$fileData = $_POST["DataURL"];
	$fileName = $_POST["FileName"];
	
	// Convert Base64 to binary.
	list($type, $fileData) = explode(';', $fileData);
	list(, $fileData)      = explode(',', $fileData);
	$fileData = base64_decode($fileData);

	// Save the binary data to logos directory.
	file_put_contents("../uploads/".$fileName, $fileData);
?>