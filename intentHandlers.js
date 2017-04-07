const welcomeIntent = require('./intents/welcomeIntent.js');
const bridgeStatusIntent = require('./intents/bridgeStatusIntent.js');

var handlers = {
	'LaunchRequest': function() { 
		welcomeIntent(this);
	},
	'BridgeStatus': function () {
		bridgeStatusIntent(this);
	}
};

module.exports = handlers;