<?php
	/*
	 Author: Gavin Youker
	 Date:   5/2/17
	 File:   /functions/upload.php
	 Info:   Gets the base64 image over POST,
	         decodes base64 into binary, 
	         saves the image on the server.
	*/
	
	// Define local variables.
	$fileName = $_POST["fileName"]."_".time().".png";
	$fileData = substr($_POST["fileData"], strpos($_POST["fileData"], ",") + 1);

	// Save the binary data to logos directory.
	$fileData = base64_decode($fileData);
	file_put_contents("../uploads/".$fileName, $fileData);
?>