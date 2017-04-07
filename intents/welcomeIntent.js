var intent = (self) => {
	console.log('Welcome intent triggered');
	self.emit(':tell', 'Okay. You can use the severn crossing skill to check the status of the old and new severn bridges. You can say things like, Alexa, ask severn crossing for an update. Or, Alexa, ask severn crossing if the new bridge is open.');
};

module.exports = intent;