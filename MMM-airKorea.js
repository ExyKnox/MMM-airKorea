Module.register("MMM-airKorea", {
	defaults: {},
	start: function () {
		Log.log("Starting module: " + this.name);
		this.airQuality_recv = {};
	},
	getStyles: function () {
		return ["MMM-airKorea.css"];
	},
	getDom: function() {
		var airKoreaContainer = document.createElement('div');
		
		if (this.airQuality_recv.hasOwnProperty('Error')){
			airKoreaContainer.innerHTML = 'ERROR!';
		} else {
			var dataTime = document.createElement('p');
			var khaiGrade = document.createElement('p'); /*통합대기환경지수*/
			var pm25 = document.createElement('p');
			var pm10 = document.createElement('p');
			var o3 = document.createElement('p');
			var no2 = document.createElement('p');
			var so2 = document.createElement('p');
			var co = document.createElement('p');

			airKoreaContainer.id = 'airKoreaContainer';
			dataTime.id = 'dataTime'
			khaiGrade.id = 'khaiGrade'
			for (let i in [pm10, pm25, o3, no2, so2, co]) {
				i.class = 'airElement';
			}

			//dataTime
			dataTime.innerHTML = this.airQuality_recv['dataTime'] + ' 기준';

			//통합대기환경지수
			var khaiGradeStatus = document.createElement('span');
			this.setColorByKhaiGrade(khaiGradeStatus, this.airQuality_recv['khaiGrade']);
			khaiGrade.innerHTML = '현재 대기질 등급: '
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

			for (let i in [dataTime, khaiGrade, pm25, pm10, o3, no2, so2, co]) {
				airKoreaContainer.append(i);
			}	
		}
		
		Log.log(airKoreaContainer);
		
		return airKoreaContainer;
	},
	notificationReceived: function(notification, payload) {
		switch(notification){
			case 'DOM_OBJECTS_CREATED':
				this.airQualityRequest(this.config.key, this.config.stationName, 'json');
		}
	},
	socketNotificationReceived: function(notification, payload) {
		switch(notification){
			case 'AIRQUALITY_RECV':
				if (payload['response']['header']['resultCode'] === "00") {
					this.airQuality_recv = payload['response']['body']['items'][0];
					Log.log(payload);
					Log.log(this.airQuality_recv);
				} else {
					Log.log('Error in fetching Data');
					this.airQuality_recv = null;
				}
				
				this.updateDom();
		}
	},
	airQualityRequest: function(key, stationName, returnType){
		Log.log([key, stationName, returnType]);
		this.sendSocketNotification('AIRQUALITY_REQ', [key, stationName, returnType]);
	},
	setColorByKhaiGrade: function (elem, grade){
		if (grade === '1') {
			// 대기질 상태 좋음
			elem.style.color = '0000FF';
		}else if (grade === '2') {
			// 대기질 상태 보통
			elem.style.color = '00FF00';
		}else if (grade === '3') {
			// 대기질 상태 나쁨
			elem.style.color = 'FFFF00';
		}else if (grade === '4') {
			// 대기질 상태 매우나쁨
			elem.style.color = 'FF0000';
		}
	}
})