var severnCrossingService = require('../severnCrossingService.js');

var intent = (self) => {
	console.log('BridgeStatus intent triggered');
	severnCrossingService.getBridgeStatus().then((model) => {
		console.log('Building response text');

		var m4 = model.bridges.filter((bridge) => {
			return bridge.name == "M4"
		})[0];

		var m48 = model.bridges.filter((bridge) => {
			return bridge.name == "M48"
		})[0];

		var responseText;
		if (m4.isOpen && m48.isOpen) {
			responseText = "Both the old and new bridges are open to all traffic at the moment!";
		} else if (m4.isOpen && !m48.isOpen) {
			responseText = "There are no issues reported for the new bridge but the status of the old bridge is... " + m48.text;
		} else if (!m4.isOpen && m48.isOpen) {
			responseText = "There are no issues reported for the old bridge but the status of the new bridge is... " + m4.text;
		} else if (!m4.isOpen && !m48.isOpen) {
			responseText = "The status of the new bridge is... " + m4.text + " and the status of the old bridge is... " + m48.text;
		}

		console.log('Responding with ' + responseText);
		self.emit(':tell', responseText);
	});
};

module.exports = intent;