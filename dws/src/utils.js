var Util = {};  // Why Utils = function() {}; ?? Rather than {};?

// ---------------------------
// GET & CHECK Variable Types Check

Util.isTypeObject = function (obj) {
	// Array is also 'object' type, thus, check to make sure this is not array.
	if (Util.isTypeArray(obj)) return false;
	else return (obj !== undefined && typeof (obj) === 'object');
};

Util.isTypeArray = function (obj) {
	return (obj !== undefined && Array.isArray(obj));
};

Util.isTypeString = function (obj) {
	return (obj !== undefined && typeof (obj) === 'string');
};

// ------------------------------------

Util.getStr = function (input, limit, tailStr) {
	var value = '';

	try {
		if (input !== undefined && input !== '') {
			// Convert the input into string value.
			if (Util.isTypeObject(input) || Util.isTypeArray(input)) value = JSON.stringify(input);
			else if (Util.isTypeString(input)) value = input;
			else value = input.toString();

			// If limit is passed, cut the length of string value to that limit length.
			if (limit && value.length > limit) {
				value = value.substr(0, limit);

				if (!tailStr) tailStr = '...';

				if (Util.isTypeString(tailStr)) value += tailStr;
			}
		}
	}
	catch (errMsg) {
		console.log('ERROR in Util.getStr, errMsg: ' + errMsg);
	}

	return value;
};


Util.getEvalStr = function (evalObj) {
	var evalStr = '';

	try {
		if ( evalObj )
		{
			if (Util.isTypeString(evalObj)) evalStr = evalObj;
			else if (Util.isTypeArray(evalObj)) evalStr = evalObj.join('\r\n');	
		}
	}
	catch (errMsg) {
		console.log('ERROR in blockForm.getEvalStr, errMsg: ' + errMsg);
	}

	return evalStr;
};

// ----------------------------------
// JSON Copy Related

Util.cloneJson = function (jsonObj) {
	return Util.getJsonDeepCopy(jsonObj);  // Use this instead? {...jsonObj}
};

// Handles both object and array
Util.getJsonDeepCopy = function (jsonObj) {
	var newJsonObj;

	if (jsonObj) {
		try {
			newJsonObj = JSON.parse(JSON.stringify(jsonObj));
		}
		catch (errMsg) {
			console.log('ERROR in Util.getJsonDeepCopy, errMsg: ' + errMsg);
		}
	}

	return newJsonObj;
};

Util.printJson = function( input )
{
	var result = {};

	try
	{
		if ( Util.isTypeObject( input ) ) result = input;
		else result.result = input;

		console.log( JSON.stringify( result ) );
	}
	catch( errMsg ) { console.log( 'ERROR in Util.printJson, ' + errMsg ); }

	return result;
};

// ------------------------------

Util.padWithLeadingZeros = function (num, totalLength) 
{
   return String(num).padStart(totalLength, '0');
};

// Checks if the json is emtpy
Util.isObjEmpty = function (obj) {
	return (Object.keys(obj).length === 0);
};

Util.isJsonEmpty = function (obj) {
	Util.isObjEmpty(obj);
};

// -----------------------------------

Util.array_TakeOutOne = function (arr) {
	var returnArr = [];

	if (arr) arr.splice(0, 1);

	return (returnArr.length > 0) ? returnArr[0] : undefined;
};

// NOTE: Should be named 'append'?
Util.mergeArrays = function (mainArr, newArr) {
	for (var i = 0; i < newArr.length; i++) {
		mainArr.push(newArr[i]);
	}
};

Util.appendArray = function (mainArr, newArr) {
	Util.mergeArrays(mainArr, newArr);
};

Util.getCombinedArrays = function (arr1, arr2) {
	var combinedArr = [];

	for (var i = 0; i < arr1.length; i++) combinedArr.push(arr1[i]);
	for (var i = 0; i < arr2.length; i++) combinedArr.push(arr2[i]);

	return combinedArr;
};

Util.mergeArrayUnique = function ( arr1, arr2 )
{
	// returns new array with combined
	if ( !arr1 ) arr1 = [];
	if ( !arr2 ) arr2 = [];

	return arr1.concat(arr2.filter(function (item) {
		 return arr1.indexOf(item) === -1;
	}));
};

Util.mergeJson = function (destObj, srcObj) {
	if (srcObj && Util.isTypeObject( srcObj ) ) {
		for (var key in srcObj) {
			destObj[key] = srcObj[key];
		}
	}

	return destObj;
};

Util.mergeDeep = function (dest, obj, option) 
{
	if ( !option ) option = {};

	Object.keys(obj).forEach(key => {

		var dVal = dest[key];
		var oVal = obj[key];

		if (Util.isTypeArray(dVal) && Util.isTypeArray(oVal)) {
			if (option && option.arrOverwrite && oVal.length > 0) dest[key] = oVal;
			else Util.mergeArrays(dVal, oVal);
		}
		else if (Util.isTypeObject(dVal) && Util.isTypeObject(oVal)) {
			Util.mergeDeep(dVal, oVal, option);
		}
		else {
			if (option && option.keepTargetVal && dest[key] ) { } // with Option, keep original if both exists
			else dest[key] = oVal;
		}
	});

	//return prev;
};


// -----------------------

module.exports = Util;
