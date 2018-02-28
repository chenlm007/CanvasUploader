<%@ Language=C# %>
<%
	// Author: Gavin Youker
	// Date:   5/2/17
	// File:   /functions/upload.asp
	// Info:   Gets the base64 image over POST,
	//         decodes base64 into binary, 
	//         saves the image on the server.

	// Define local variables.
	string fileName = Request.Form["fileName"] + "_" + Math.Ceiling(DateTime.Now.Subtract(DateTime.MinValue.AddYears(1969)).TotalSeconds) + ".png";
	string fileData = Request.Form["fileData"].Substring(Request.Form["fileData"].IndexOf(",") + 1);

	//Read the uploaded file using BinaryReader and convert it to Byte Array.
	Byte[] bytes = Convert.FromBase64String(fileData);
	File.WriteAllBytes("../uploads/" + fileName, bytes);
%>