const Utils = require("./utils");
const ActionSrv = require("./actionSrv");

var runActionSet = async function( actionSetDEF, passData )
{
	var result;

	if ( !passData ) passData = {};

	var VARS = passData.VARS; // actionSet flow accessable variables
	var ACTIONS = passData.ACTIONS; // Flow of Actions..  But DEBUG has this info..  Duplicate data..
	var DEBUG = passData.DEBUG;
	DEBUG.actionProcessed = [];


	if ( actionSetDEF && actionSetDEF.length > 0 )
	{
		var actionIdx = 0;
		var actionDEF_Next = actionSetDEF[ actionIdx ];

		do 
		{
			var actionJson = {};
			var actionDEF = actionDEF_Next;
			actionDEF_Next = '';

			var actionDebug = { actionIdx, id: actionDEF.id, actionDEF: actionDEF };
			DEBUG.actionProcessed.push( actionDebug );

			try 
			{
				actionJson = await ActionSrv.runAction( actionDEF, { VARS, ACTIONS } );
				
				Utils.mergeJson( actionDebug, actionJson ); // Add the output to 'actionDebug'

				ACTIONS[actionDEF.id] = actionJson;
				result = actionJson.ACTION;


				// Next action decide - by 
				actionIdx++;

				var goToEval = Utils.getStr( actionJson.goToEval );
				actionDebug.goToEval = goToEval;	// Debug


				// Set 'actionDEF_Next' from 'goToVal' value
				if ( goToEval === 'FINISH' ) actionDEF_Next = '';
				else if ( goToEval === 'ERROR' ) throw "goToEval ERROR Case";
				else if ( goToEval === 'NEXT' || !goToEval ) 
				{
					if ( actionIdx < actionSetDEF.length ) actionDEF_Next = actionSetDEF[ actionIdx ];
					else actionDEF_Next = '';
				}
				else if ( goToEval ) // action named goToEval Case
				{
					var goToActionIdx = actionSetDEF.indexOf( goToEval );
					if ( goToActionIdx === -1 ) throw "Invalid goTo ActionName: " + goToEval;
					else {
						actionIdx = goToActionIdx;
						actionDEF_Next = actionSetDEF[ actionIdx ];
					}
				}

				// Debug
				actionDebug.actionDEF_Next = actionDEF_Next;

			}
			catch( errMsg ) 
			{ 
				actionDEF_Next = '';
				result = { errorMsg: 'ERROR in action ' + actionDEF.id + ', ' + errMsg } // , actionJson: actionJson };
				console.log( "ACTION ERROR - " + errMsg ); // TODO: if 'ERR_CATCH_action' exists (epecified), go to that action..
				actionDebug.actionLoopErrMsg = errMsg;
			} 

		} 
		while ( actionDEF_Next ); //  actionIdx < actionSetDEF.length && next_ac !== 'FINISH' );

	}

	return result;
};

// ------------------------
module.exports = {
	runActionSet: runActionSet
};
