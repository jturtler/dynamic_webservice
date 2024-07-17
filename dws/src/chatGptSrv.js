const axios = require("axios");
const Utils = require("./utils");

var _bearerToken = '--- FROM .ENV ---';
var _url = 'https://api.openai.com/v1/chat/completions';

var requestSend = async function ( reqBody ) 
{
	var returnJson = {};

	try
	{		
		returnJson.reqBody = reqBody;

		if ( !reqBody.inputMsg ) throw "inputMsg is required input in chatGptSrv";

		if ( reqBody.pin !== '1212' ) throw "pin number is not correct";

		var inputJson = {
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "user", content: reqBody.inputMsg }
			],
			temperature: 0.7
	  	};
		returnJson.inputJson = inputJson;


		returnJson.responseJson = await sendPostRequest( _url, inputJson );

		
		var msgChoices = returnJson.responseJson.choices;

		if ( msgChoices && msgChoices.length > 0 )
		{
			var msgJson = msgChoices[0].message;
			returnJson.returnMsg = Utils.getStr( msgJson.content );
		} 
	}
	catch( errMsg ) 
	{
		console.log( 'ERROR in chatGptSrv.request, ' + errMsg );
		returnJson.errorMsg = errMsg;
	}
	
	return returnJson;	
};


var sendPostRequest = async function( url, data ) 
{
	 var response = await fetch( url, {
		  headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + _bearerToken },
		  method: 'POST',
		  body: JSON.stringify(data)
	 });

	 return await response.json();
};

/*
var runRequest = async function( apiRequest, acData )
{
	try
	{
		if ( !apiRequest.use || apiRequest.use === 'axios' )
		{
			var apiResponse = await axios( apiRequest ); // await axios( {"method":"get","url":"https://api-dev.psi-connect.org/info"} );
			//acData.requestResponse = apiResponse;  // Does not work with JSON.stringify( --- )  <-- circular reference?
			
			acData.requestResponseStatus = apiRequest.status;
			acData.requestResponseData = apiResponse.data;

			if (apiResponse.status >= 300) throw 'Response Bad Status - ' + apiResponse.status;
		}
	}
	catch( errMsg ) 
	{ 
		console.log( 'ERROR in runReuqest, ' + errMsg ); 
		acData.requestResponseError = errMsg;
	}
};
*/

// ------------------------
module.exports = {
	requestSend: requestSend
};
