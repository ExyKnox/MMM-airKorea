Module.register("MMM-airKorea", {
	defaults: {
		// updateInterval: 1000 * 60 * 10, // 10 minutes
		updateInterval: 1000 * 60,
	},
	start: function () {
		Log.log("Starting module: " + this.name);
		this.airQuality_recv = {};
	},
	getStyles: function () {
		return ["MMM-airKorea.css"];
	},
	getScripts: function () {
		return ["moment.js"];
	},
	getDom: function() {
		var airKoreaContainer = document.createElement('div');
		
		if (this.airQuality_recv.hasOwnProperty('Error')){
			// airKoreaContainer.innerHTML = 'ERROR! <br>' + this.airQuality_recv['Error'];
			airKoreaContainer.innerHTML = 'ERROR!';
		} else {
			var dataInfo = document.createElement('p');
			var khaiGrade = document.createElement('p'); /*통합대기환경지수*/
			var pm25 = document.createElement('p');
			var pm10 = document.createElement('p');
			var o3 = document.createElement('p');
			var no2 = document.createElement('p');
			var so2 = document.createElement('p');
			var co = document.createElement('p');

			airKoreaContainer.id = 'airKoreaContainer';
			dataInfo.id = 'dataInfo'
			khaiGrade.id = 'khaiGrade'
			for (let i of [pm10, pm25, o3, no2, so2, co]) {
				i.className = 'airElement';
			}

			//dataInfo
			dataInfo.innerHTML = this.config.stationName + ', ' + this.airQuality_recv['dataTime'] + ' 기준';

			//통합대기환경지수
			var khaiGradeStatus = document.createElement('span');
			khaiGradeStatus.id = 'khaiGradeStatus';
			this.setColorByKhaiGrade(khaiGradeStatus, this.airQuality_recv['khaiGrade']);
			khaiGrade.innerHTML = '현재 대기질 등급'
			khaiGrade.append(document.createElement('p'));
			if (this.airQuality_recv['khaiGrade'] === '1') {
				// 대기질 상태 좋음
				khaiGradeStatus.innerHTML = '좋음(' + this.airQuality_recv['khaiValue'] + ')';
			}else if (this.airQuality_recv['khaiGrade'] === '2') {
				// 대기질 상태 보통
				khaiGradeStatus.innerHTML = '보통(' + this.airQuality_recv['khaiValue'] + ')';
			}else if (this.airQuality_recv['khaiGrade'] === '3') {
				// 대기질 상태 나쁨
				khaiGradeStatus.innerHTML = '나쁨(' + this.airQuality_recv['khaiValue'] + ')';
			}else if (this.airQuality_recv['khaiGrade'] === '4') {
				// 대기질 상태 매우나쁨
				khaiGradeStatus.innerHTML = '매우나쁨(' + this.airQuality_recv['khaiValue'] + ')';
			}
			khaiGrade.append(khaiGradeStatus);

			var pm25Value = document.createElement('span');
			this.setColorByKhaiGrade(pm25Value, this.airQuality_recv['pm25Grade']);
			pm25.innerHTML = 'PM2.5 : ';
			pm25Value.innerHTML = this.airQuality_recv['pm25Value'] + ' ug/m<sup>3</sup>';
			pm25.append(pm25Value);

			var pm10Value = document.createElement('span');
			this.setColorByKhaiGrade(pm10Value, this.airQuality_recv['pm10Grade']);
			pm10.innerHTML = 'PM10 : ';
			pm10Value.innerHTML = this.airQuality_recv['pm10Value'] + ' ug/m<sup>3</sup>';
			pm10.append(pm10Value);

			var o3Value = document.createElement('span');
			this.setColorByKhaiGrade(o3Value, this.airQuality_recv['o3Grade']);
			o3.innerHTML = 'O<sup>3</sup> : ';
			o3Value.innerHTML = this.airQuality_recv['o3Value'] + ' ppm';
			o3.append(o3Value);

			var no2Value = document.createElement('span');
			this.setColorByKhaiGrade(no2Value, this.airQuality_recv['no2Grade']);
			no2.innerHTML = 'NO<sup>2</sup> : ';
			no2Value.innerHTML = this.airQuality_recv['no2Value'] + ' ppm';
			no2.append(no2Value);

			var so2Value = document.createElement('span');
			this.setColorByKhaiGrade(so2Value, this.airQuality_recv['so2Grade']);
			so2.innerHTML = 'SO<sup>2</sup> : ';
			so2Value.innerHTML = this.airQuality_recv['so2Value'] + ' ppm';
			so2.append(so2Value);

			var coValue = document.createElement('span');
			this.setColorByKhaiGrade(coValue, this.airQuality_recv['coGrade']);
			co.innerHTML = 'CO : ';
			coValue.innerHTML = this.airQuality_recv['coValue'] + ' ppm';
			co.append(coValue);

			for (let i of [dataInfo, khaiGrade, pm25, pm10, o3, no2, so2, co]) {
				airKoreaContainer.append(i);
			}	
		}
		
		Log.log(airKoreaContainer);
		
		return airKoreaContainer;
	},
	notificationReceived: function(notification, payload) {
		var self = this;
		switch(notification){
			case 'DOM_OBJECTS_CREATED':
				self.airQualityRequest(self.config.key, self.config.stationName, 'json');
				setInterval(function() {
					if (self.airQuality_recv.hasOwnProperty('Error')) {
						self.airQualityRequest(self.config.key, self.config.stationName, 'json');
						Log.log('Requested new air quality data');
					}else{
						// moment().unix() returns unix timestamp(second value)
						var elapsedTime = moment().unix() - moment(self.airQuality_recv['dataTime'], 'YYYY-MM-DD HH:mm').unix()
						
						/* debug
						Log.log('timeNow: ' + moment().unix());
						Log.log('dataTime: ' + moment(self.airQuality_recv['dataTime'], 'YYYY-MM-DD HH:mm').unix());
						Log.log('elapsedTime: ' + elapsedTime);
						*/

						if (elapsedTime > 60 * 60 /* 1 hour */){
							self.airQualityRequest(self.config.key, self.config.stationName, 'json');
							Log.log('Requested new air quality data: 1 hour elapsed from previous data');
						}	
					}
				}, self.config.updateInterval);
		}
	},
	socketNotificationReceived: function(notification, payload) {
		switch(notification){
			case 'AIRQUALITY_RECV':
				try {
					this.airQuality_recv = payload['response']['body']['items'][0]
					Log.log(this.airQuality_recv);
				} catch (e) {
					Log.log('Error in fetching data: ' + e);
					if (Object.keys(this.airQuality_recv).length <= 1){
						this.airQuality_recv['Error'] = e;	
					}
				}
				
				this.updateDom();
		}
	},
	airQualityRequest: function(key, stationName, returnType){
		Log.log([key, stationName, returnType]);
		this.sendSocketNotification('AIRQUALITY_REQ', [key, stationName, returnType]);
	},
	setColorByKhaiGrade: function (elem, grade){
		if (grade === null){
			// 점검및교정 or 점검중. 회색
			elem.style.color = 'grey';
		}else if (grade === '1') {
			// 대기질 상태 좋음
			elem.style.color = '#32C8FF';
		}else if (grade === '2') {
			// 대기질 상태 보통
			elem.style.color = '#00FF00';
		}else if (grade === '3') {
			// 대기질 상태 나쁨
			elem.style.color = '#FFFF00';
		}else if (grade === '4') {
			// 대기질 상태 매우나쁨
			elem.style.color = '#FF0000';
		}
	}
})