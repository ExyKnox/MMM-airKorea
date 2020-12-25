Module.register("MMM-airKorea", {
	defaults: {},
	start: function () {
		Log.log("Starting module: " + this.name);
		Log.log(this.getAirQuality(this.config.stationName, this.config.key, 'json'));
	},
	getStyles: function () {
		return ["MMM-airKorea.css"];
	},
	getDom: function() {
		return document.createElement('div');
	},
	notificationReceived: function() {},
	socketNotificationReceived: function() {},
	getAirQuality: async function(stationName, key, returnType){
		// https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript (14 참고)
		// node_helper로 빼야 하나? async가 안 되는거 같은데
		var url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMs
		var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(key); /*Service Key*/
		queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent(returnType); /**/
		queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /**/
		queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
		queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName); /**/
		queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /**/
		queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.4'); /**/
		let obj = await (await fetch(url + queryParams)).json();
		return obj;
	},
})