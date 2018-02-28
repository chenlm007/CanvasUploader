<%@ Language=VBScript %>
<%
	' Author: Gavin Youker
	' Date:   5/2/17
	' File:   /functions/upload.asp
	' Info:   Gets the base64 image over POST,
	'         decodes base64 into binary, 
	'         saves the image on the server.
	
	' Define local variables.
	fileName = Request.Form("fileName") & "_" & DateDiff("s", "01/01/1970 00:00:00", Now()) & ".png"
	fileData = Request.Form("fileData")

	' Convert Base64 to binary.
	Set binData = Server.CreateObject("MSXML2.DomDocument").CreateElement("b64")
	binData.DataType = "bin.base64"
	binData.Text = Mid(fileData, InStr(fileData, ",") + 1)

	' Save the binary data to the logos directory.
	Set streamFile = server.CreateObject("ADODB.stream")
	streamFile.Type =  1
	streamFile.Open()

	streamFile.Write(binData.NodeTypedValue)
	streamFile.SaveToFile(Server.Mappath("../uploads/" & fileName))

	streamFile.Close()
	Set streamFile = Nothing
%>