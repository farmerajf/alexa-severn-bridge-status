const welcomeIntent = require('./intents/welcomeIntent.js');
const bridgeStatusIntent = require('./intents/bridgeStatusIntent.js');
const balanceIntent = require('./intents/balanceIntent.js');
const crossingCountIntent = require('./intents/crossingCountIntent.js');

var handlers = {
	'LaunchRequest': function() { 
		welcomeIntent(this);
	},
	'BridgeStatus': function () {
		bridgeStatusIntent(this);
	},
	'Balance': function () {
		balanceIntent(this);
	},
	'CrossingCount': function () {
		crossingCountIntent(this);
	}
};

module.exports = handlers;