var severnCrossingService = require('../severnCrossingService.js');

var intent = (self) => {
	console.log('BalanceIntent intent triggered');
	severnCrossingService.getTagBalance().then((model) => {
		console.log('Building response text');
		var balance = model.balance;
		var crossingCount = severnCrossingService.getCrossingCount(balance);
		var responseText = 'Your tag balance is £' + balance + '. That\'s enough for ' + crossingCount + ' crossings.';

		console.log('Responding with ' + responseText);
		self.emit(':tell', responseText);
	});
};

module.exports = intent;