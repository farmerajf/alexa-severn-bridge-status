var severnCrossingService = require('../severnCrossingService.js');

var intent = (self) => {
	console.log('BridgeStatus intent triggered');
	severnCrossingService.getTextResponse().then((response) => {
		console.log('Responding with ' + response);
		self.emit(':tell', response);
	});
};

module.exports = intent;