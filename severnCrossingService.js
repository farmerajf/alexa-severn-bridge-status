const request = require('request');
const cheerio = require('cheerio');

const statusPage = 'http://www.severnbridge.co.uk/Home.aspx?FileName=bridge-status1';
const greenIcon = 'Images/Public/green-light.png';

var service = {
	getTextResponse: function getTextResponse() {
		return new Promise(function (resolve, reject) {
			service.getPage(statusPage)
			 .then(service.getStatusModel)
			 .then(service.getResponseText)
			 .then(function (result) {
			 		resolve(result);
			 })
		});
	},

	getPage: function getPage(url) {
		return new Promise(function (resolve, reject) {
			console.log('Getting content from ' + url);
			request({ url: url, strictSSL: false },
				function (error, response, html) {
					if (!error) {
						console.log('Got content from ' + url);
						resolve(html);
					} else {
						console.log('Error getting content from ' + url + ': ' + error);
						reject(Error(error))
					}
				});
		});
	},

	getStatusModel: function getStatusModel(statusPageHtml) {
		return new Promise((resolve, reject) => {
			console.log('Getting status model');
			const $ = cheerio.load(statusPageHtml);

			const m4Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_0").attr('src');
			const m48Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_1").attr('src');

			const m4Text = $("#Main_ctl00_ctl00_upList .item .status").first().text().trim();
			const m48Text = $("#Main_ctl00_ctl00_upList .item .status").last().text().trim();

			const m4Status = m4Icon == greenIcon;
			const m48Status = m48Icon == greenIcon;

			const model = {
				bridges: [
					{
						"name": "M4",
						"isOpen": m4Status,
						"text": m4Text
					},
					{
						"name": "M48",
						"isOpen": m48Status,
						"text": m48Text
					}
				]
			};

			console.log('Got model ' + model);
			resolve(model);
		});
	},

	getResponseText: function getResponseText(model) {
		return new Promise((resolve, reject) => {
			console.log('Building response text');

			var m4 = model.bridges.filter((bridge) => {
				return bridge.name == "M4"
			})[0];

			var m48 = model.bridges.filter((bridge) => {
				return bridge.name == "M48"
			})[0];

			var responseText;
			if (m4.isOpen && m48.isOpen) {
				responseText = "Great news! Both the M4 and M48 bridges are open to all traffic at the moment!";
			} else if (m4.isOpen && !m48.isOpen) {
				responseText = "Oh no! There are no issues reported for the M4 bridge but the status of the M48 bridge is... " + m48.text;
			} else if (!m4.isOpen && m48.isOpen) {
				responseText = "Oh no! There are no issues reported for the M48 bridge but the status of the M4 bridge is... " + m4.text;
			} else if (!m4.isOpen && !m48.isOpen) {
				responseText = "On no! The status of the M4 bridge is... " + m4.text + " and the status of the M48 bridge is... " + m48.text;
			}

			console.log('Built response text: ' + responseText);
			resolve(responseText);
		});
	}
};

module.exports = {
	getTextResponse: service.getTextResponse
};