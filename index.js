const request = require('request');
const cheerio = require('cheerio');
const alexaSkillKit = require('alexa-skill-kit');

const url = 'http://www.severnbridge.co.uk/Home.aspx?FileName=bridge-status1';
const greenIcon = 'Images/Public/green-light.png';

getPage((html) => getResponseText(html, (text) => console.log(text)));

exports.handler = function (event, context) {
	getPage((html) => getResponseText(html, (text) => {
		alexaSkillKit(event, context, parsedMessage => { return text; });
	}));
}

function getPage(callback) {
	request({ url: url, strictSSL: false },
		function (error, response, html) {
			if (!error) {
				callback(html);
			} else {
				console.log(error);
			}
		});
}

function getResponseText(html, callback) {
	const $ = cheerio.load(html);

	const m4Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_0").attr('src');
	const m48Icon = $("#Main_ctl00_ctl00_gridList_btnStatusIcon_1").attr('src');

	const m4Text = $("#Main_ctl00_ctl00_upList .item .status").first().text().trim();
	const m48Text = $("#Main_ctl00_ctl00_upList .item .status").last().text().trim();

	const m4Status = m4Icon == greenIcon;
	const m48Status = m48Icon == greenIcon;

	var responseText;
	if (m4Status && m48Status) {
		responseText = "Great news! Both the M4 and M48 bridges are open to all traffic at the moment!";
	} else if (m4Status && !m48Status) {
		responseText = "Oh no! There are no issues reported for the M4 bridge but the status of the M48 bridge is... " + m48Status;
	} else if (!m4Status && m48Status) {
		responseText = "Oh no! There are no issues reported for the M48 bridge but the status of the M4 bridge is... " + m4Status;
	} else if (!m4Status && !m48Status) {
		responseText = "On no! The status of the M4 bridge is... " + m4Status + " and the status of the M48 bridge is... " + m48Status;
	}

	callback(responseText);
}
