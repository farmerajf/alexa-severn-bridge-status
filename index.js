const request = require('request');
const cheerio = require('cheerio');
const alexaSkillKit = require('alexa-skill-kit');

const statusPage = 'http://www.severnbridge.co.uk/Home.aspx?FileName=bridge-status1';
const greenIcon = 'Images/Public/green-light.png';

process((output)=>{
	console.log(output);
})

exports.handler = function (event, context) {
	process((output)=>{
		alexaSkillKit(event, context, parsedMessage => { return output; });
	});
}

function process(outputMethod) {
	getPage(statusPage)
		.then(getStatusModel)
		.then(getResponseText)
		.then((result => { outputMethod(result); }));
}

function getPage(url) {
	return new Promise(function (resolve, reject) {
		request({ url: url, strictSSL: false },
			function (error, response, html) {
				if (!error) {
					resolve(html);
				} else {
					console.log(error);
					reject(Error(error))
				}
			});
	});
}

function getStatusModel(statusPageHtml) {
	return new Promise((resolve, reject) => {
		const $ = cheerio.load(statusPageHtml);

		const m4Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_0").attr('src');
		const m48Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_1").attr('src');

		const m4Text = $("#Main_ctl00_ctl00_upList .item .status").first().text().trim();
		const m48Text = $("#Main_ctl00_ctl00_upList .item .status").last().text().trim();

		const m4Status = m4Icon == greenIcon;
		const m48Status = m48Icon == greenIcon;

		resolve({
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
		});
	});
}

function getResponseText(model) {
	return new Promise((resolve, reject) => {
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

		resolve(responseText);
	});
}
