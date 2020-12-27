var NodeHelper = require("node_helper");
// var async = require('async');
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
	start: function () {},
	notificationReceived: function() {},
	socketNotificationReceived: function(notification, payload) {
		switch(notification){
			case 'AIRQUALITY_REQ':
				this.getAirQuality(payload[0], payload[1], payload[2]);
		}
	},
	async getAirQuality(key, stationName, returnType){
		// https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript (14 참고)
		// node_helper로 빼야 하나? async가 안 되는거 같은데
		var url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
		var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key; /*Service Key*/
		queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent(returnType); /**/
		queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /**/
		queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
		queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName); /**/
		queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /**/
		queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /**/
		let obj = null;
		try {
			obj = await (await fetch(url + queryParams)).json();
		} catch(e) {
			obj = {'Error': 'Error in fetching data'};
		}
		this.sendSocketNotification('AIRQUALITY_RECV', obj);
		return obj;
	},
});
