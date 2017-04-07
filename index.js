
const alexaSdk = require('alexa-sdk');
const intentHandlers = require('./intentHandlers.js');

exports.handler = function (event, context) {
	console.log('Starting request');
	var alexa = alexaSdk.handler(event, context);
	alexa.registerHandlers(intentHandlers);
	console.log('Registered handlers');
	console.log('Executing');
	alexa.execute();
};

//Local Test
const severnCrossingService = require('./severnCrossingService.js');
// severnCrossingService.getBridgeStatus().then(function (response) { console.log('Done') });
severnCrossingService.getTagBalance().then(function (response) { 
	console.log(response) 
	console.log(severnCrossingService.getCrossingCount(response.balance));
});