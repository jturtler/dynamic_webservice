const axios = require("axios");
const Utils = require("./utils");

var _endpoints = {}; // Keep the structure if exported as it is, not using method.

const data = {
	authKey: process.env.AUTH_KEY,  // Make this environment variable..
	gitAccept: 'application/vnd.github.raw+json'
};

var _gitRepoUrl = process.env.GIT_REPO_URL;

var retrieveGit = async function (url) {
	// Load Configs..
	var response = await axios.get(url,
		{
			headers: {
				'Authorization': 'Bearer ' + data.authKey,
				'Accept': data.gitAccept
			}
		}
	);

	if (response.status >= 300) throw 'Error during git retrieval';

	return response.data;
};


var loadEndpoints_fromGit = async function ( gitUrlEnding ) {
	console.log('[Started] - loading Git endpoints..');

	var gitUrl = _gitRepoUrl + gitUrlEnding;

	// 1. 'endPoints.json' file load.. <-- Not simply overriding the reference, but merging to keep the structure.
	_endpoints = await retrieveGit( gitUrl.replace( '[FILE_PATH]', 'endpoints.json' ) ); // Utils.mergeJson( 

	// 2. Each endpoint file load (eval)
	// console.log('[TODO] - Need to populate the endpoint actions');
	await populateEndpoints( gitUrl, _endpoints );

	console.log('[Finished] - loading Git endpoints..');
};


var populateEndpoints = async function ( gitUrl, endpoints ) 
{
	//  "TTS.wfaAppVer": { "file": "endpointActions/ws_v2@TTS@james.json", "actionSet": "wfaAppVer", "loadAtStart": true }
	if ( endpoints ) 
	{
		for (var propName in endpoints) 
		{
			var propValJson = endpoints[propName];
			// console.log( propName );

			if ( propValJson.loadAtStart && propValJson.file )
			{
				try
				{
					propValJson.fileJson = await retrieveGit( gitUrl.replace( '[FILE_PATH]', propValJson.file ) );

					// 'actionSetJson' get from 'actionSetList'	
				}
				catch ( errMsg ) {  console.log( 'ERROR in populateEndpoints prop file retrieval, ' + errMsg ); }
			}
		}
	}
};

var checkEndpoints = function( endpoints ) 
{
	console.log( '[LOADED ENDPOINTS]: ' );

	for (var propName in endpoints) 
	{
		var propValJson = endpoints[propName];

		console.log( ' - ' + propName + ' --> fileJson loaded: ' + Utils.isTypeObject( propValJson.fileJson ) );
	}
};


var getEndpoints = function()
{
	return _endpoints;
};


// ------------------------
module.exports = {
	loadEndpoints_fromGit: loadEndpoints_fromGit,
	checkEndpoints: checkEndpoints,
	getEndpoints: getEndpoints,
	endpoints: _endpoints	// Obsolete?
};
