# MMM-airKorea
MM2 module displays air pollution status from airKorea   

![MMM-airKorea.png](/MMM-airKorea.PNG)   

https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861   
한국환경공단 airKorea에서 대기오염 정보를 받아와 표시하는 Magicmirror2 모듈입니다.   

## Embedding MMM-airKorea
``` JS
modules: [
    {
		module: "MMM-airKorea",
		position: "top_right",
		config: {
			key:'YOUR_KEY_HERE',
			stationName: 'STATION_NAME',
			updateInterval: 1000 * 60,
		}
	},
]
```

## Configuration

|Option|Description                          |
|------|-------------------------------------|
|key        |공공데이터포털의 인증키를 입력합니다.|
|stationName|airKorea의 측정소 이름을 입력합니다.<br /> 측정소 이름은 [에어코리아](https://www.airkorea.or.kr/index) **측정소 검색** 버튼에서 검색하시면 됩니다.|
