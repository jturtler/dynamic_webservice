const Utils = require("./utils");
const ActionSetSrv = require("./actionSetSrv");

var VARS = {};
var ACTIONS = {};
var DEBUG = {};


// NOTES:
// 	1. 'log' that holds the trace of flow / processing - optional return tracing..

var runEndpoint = async function ( endpointName, endpointsData, reqData ) 
{
	var returnJson = { };
	var bDebugMode = ( reqData.reqParams.debug || reqData.reqBody.debug );
	var bResultInTopLayer = ( reqData.reqParams.resultInTopLayer || reqData.reqBody.resultInTopLayer );

	try
	{
		var endpointData = endpointsData[ endpointName ];

		if ( !endpointData ) throw "Endpoint does not exist!";
		else if ( !endpointData.fileJson ) throw "Endpoint fileJson not loaded"; // auto load & perform it?
		else {
			VARS = {};
			ACTIONS = {};
			DEBUG = {};

			if ( bDebugMode ) returnJson.DEBUG = DEBUG;  // { DEBUG, ACTIONS }
			
			var fileJson = endpointData.fileJson;

			// Variables create
			setFileVariables( fileJson.variables );

			// ActionSet Run
			var actionSet = getActionSetFromList( fileJson.actionSetList, endpointData.actionSet );
			if ( actionSet ) {
				var result = await ActionSetSrv.runActionSet( actionSet, { VARS, ACTIONS, DEBUG } );

				if ( bResultInTopLayer ) Utils.mergeJson( returnJson, result );
				else returnJson.result = result;
			}
			else throw 'actionSet definition not found.';
		}
	}
	catch( errMsg ) 
	{
		console.log( 'ERROR in endpointSrv.runEndpoint, ' + errMsg );
		returnJson.errorMsg = errMsg;
		returnJson.DEBUG = DEBUG;
	}
	
	return returnJson;	
};


var setFileVariables = function( variables )
{
	if ( variables )
	{
		for ( var propName in variables )
		{
			VARS[ propName ] = variables[ propName ];
		}
	}
};


// "variables": {  "server": "https://cws-dhis.psi-mis.org",  "jobsPort": "8383"  },
//	"actionSetList": {  "test0": [ ...
var getActionSetFromList = function( actionSetList, actionSetName )
{
	var actionSet;

	if ( actionSetList )
	{
		if ( actionSetName ) actionSet = actionSetList[ actionSetName ];
	}

	return actionSet;
};

// ------------------------
module.exports = {
	runEndpoint: runEndpoint
};
