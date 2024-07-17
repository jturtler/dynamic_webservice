require('dotenv').config();
const express = require("express"); //Import the express dependency
const bodyParser = require('body-parser');
const startUpActions = require("./src/startUpActions");
const endpointSrv = require("./src/endpointSrv");
const chatGptSrv = require("./src/chatGptSrv");

const app = express(); //Instantiate an express app, the main work horse of this server
const PORT = process.env.PORT || 3010;

// Middleware
app.use( bodyParser.json() );
app.use( express.static('public') );
//app.use(express.static(path.join(__dirname, 'public')));


var appInfo = {
	name: 'dws',
	version: '1.0.0',
	lastChangeDate: '2024-03-09',
	serviceStarted: new Date().toString(),
	serviceStartedUTC: new Date().toISOString()
};


// -----------------------
// -- Call 'endpoints'
// App Info - Default GET
app.get("/apiDws/info", function (req, res) {
	res.send(appInfo);
});


// Execute the endpoint with POST
app.post("/apiDws/:endpoint", (request, response) => {

	var endpoint = request.params.endpoint;

	endpointSrv.runEndpoint( endpoint, startUpActions.getEndpoints(), { reqParams: request.params, reqBody: request.body } ).then( result => response.send(result) );

	// response.send(result);
});


// -------------

app.post('/apiChat/chatAI', (req, res) => {

	// console.log( req.body );
	var reqPayloadJson = req.body;

	chatGptSrv.requestSend( req.body ).then( result => res.send( result ) );
});



// ----------------------------------
// -- App Calling internal API testing:  OBSOLETE!!!
// In-memory data store (Replace this with a database in a real application)
let items = [];

// Routes
// Get all items
app.get('/apiItem/items', (req, res) => {
	res.json(items);
});

// Add a new item
app.post('/apiItem/items', (req, res) => {
	const newItem = req.body;
	console.log( JSON.stringify( req.body ) );
	items.push(newItem);
	res.status(201).json(newItem);
	console.log( JSON.stringify( items ) );
});

// Update an item
app.put('/apiItem/items/:id', (req, res) => {
	const itemId = req.params.id;
	const updatedItem = req.body;
	items = items.map(item => (item.id === itemId ? updatedItem : item));
	res.json(updatedItem);
});

// Delete an item
app.delete('/apiItem/items/:id', (req, res) => {
	const itemId = req.params.id;
	items = items.filter(item => item.id !== itemId);
	res.sendStatus(204);
});

// -----------------------------

var startUpService = async function () {

	try {
		checkEnvVars();

		await startUpActions.loadEndpoints_fromGit('/[FILE_PATH]?ref=main');
		startUpActions.checkEndpoints(startUpActions.getEndpoints());

		
		// Server Listen Service Start:
		app.listen(PORT, () => {  console.log(`Now listening on port ${PORT}`); });
	}
	catch (errMsg) { console.log('ERROR - ' + errMsg); }
};

var checkEnvVars = function () {
	if (!process.env.AUTH_KEY) throw 'ENV "AUTH_KEY" needs to be setup 1st!!';
	if (!process.env.GIT_REPO_URL) throw 'ENV "GIT_REPO_URL" needs to be setup 1st!!';
};


// -----------------------------------

startUpService();
