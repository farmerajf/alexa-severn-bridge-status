const request = require('request');
const cheerio = require('cheerio');

const statusPage = 'http://www.severnbridge.co.uk/Home.aspx?FileName=bridge-status1';
const balancePage = 'https://tolling.severnbridge.co.uk/account/index.php';
const balanceCreds = { account_number: process.env.severn_crossing_account_number, password: process.env.severn_crossing_password, id: 'login' };
const greenIcon = 'Images/Public/green-light.png';
const crossingCost = 6.70;

var service = {
	getBridgeStatus: function getTextResponse() {
		return new Promise(function (resolve, reject) {
			service.getPage(statusPage)
				.then(service.getStatusModel)
				.then(function (result) {
					resolve(result);
				})
		});
	},

	getTagBalance: () => {
		return new Promise((resolve, reject) => {
			service.postForm(balancePage, balanceCreds)
				.then(service.getBalanceModel)
				.then((result) => {resolve(result)});
		})
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

	postForm: (url, data) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: url, form: data
			},
				(error, response, html) => {
					if (!error) {
						console.log('Posted data to ' + url);
						resolve(html);
					} else {
						console.log('Error posting data to ' + url + ': ' + error);
						reject(Error(error));
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

	getBalanceModel: (balancePageHtml) => {
		return new Promise((resolve, reject) => {
			console.log('Getting balance model');

			var balance = balancePageHtml.match(/<td>&pound;(.+)<\/td>/);
			resolve({ balance: balance[1]});
		});
	},

	getCrossingCount: (balance) => {
		return crossingCount = (parseFloat(balance) / crossingCost) | 0;
	}
};

module.exports = {
	getBridgeStatus: service.getBridgeStatus,
	getTagBalance: service.getTagBalance,
	getCrossingCount: service.getCrossingCount
};