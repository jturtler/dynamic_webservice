const axios = require("axios");
const Utils = require("./utils");

// Action Class?  -- Need a separate class for this?
//		- What is 'action' class?
// 	- 'request' operation exists  
//		- also create proper action json <-- resulting one..  has 'goTo', has 'goToActionSet', request, etc..

var runAction = async function ( actionDEF, passData ) 
{
	if ( !passData ) passData = {};

	var { VARS, ACTIONS } = passData; // .VARS; // actionSet flow accessable variables

	var acData = { };  // id: actionDEF.id, actionDEF: actionDEF };  // No need to have 'id' & 'actionDef' here..

	try 
	{
		// 1. Create Action Objects: 'ACTION' object
		var ACTION = {};

		// 2. Run 'request' / 'goToActionSet', 'goToEndPoint', 'goTo'
		if ( actionDEF.request ) await runRequest( actionDEF.request, acData );

		// 3. 'eval' part of action
		eval( Utils.getEvalStr( actionDEF.eval ) );
		
		// 4. 'goToEval'
		if ( actionDEF.goToEval ) acData.goToEval = eval( actionDEF.goToEval );

		// 5. FINAL. Set the result into last result?
		acData.ACTION = ACTION;
	}
	catch( errMsg )
	{
		acData.errorMsg = errMsg;
		throw 'ACTION ERROR in action (' + acData.id + ') - ' + errMsg;
	}

	return acData;
};


// method: 'get', url: '---', data: { }, 
//		<-- use: 'axios'?  Other library? <-- Default..
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


// ------------------------
module.exports = {
	runAction: runAction
};
