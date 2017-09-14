<%
	' Author: Gavin Youker
	' Date:   5/2/17
	' File:   /functions/upload.asp
	' Info:   Gets the base64 image over POST,
	'         and decodes base64 into binary.
	'         Then, saves the image on the server.
	
	' Define local variables.
	Dim fileData, fileName
	Dim tmpDoc, nodeB64, streamFile
	
	fileData = Request.Form("DataURL")
	fileName = Request.Form("FileName")

	' Convert Base64 to binary.
	Set tmpDoc = Server.CreateObject("MSXML2.DomDocument")
	Set nodeB64 = tmpDoc.CreateElement("b64")
	nodeB64.DataType = "bin.base64"
	nodeB64.Text = Mid(fileData, InStr(fileData, ",") + 1)

	' Save the binary data to the logos directory.
	Set streamFile = server.CreateObject("ADODB.stream")
	streamFile.Type =  1
	streamFile.Open()

	streamFile.Write(nodeB64.NodeTypedValue)
	streamFile.SaveToFile(Server.Mappath("../uploads/" & fileName))
	Response.Write(fileName)

	streamFile.Close()
	Set streamFile = Nothing
%>