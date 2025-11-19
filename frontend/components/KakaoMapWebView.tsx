// frontend/app/components/KakaoMapWebView.tsx
import React from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

export default function KakaoMapWebView() {
    const KAKAO_APP_KEY = "77071dae8211dcfd03ae5fc56af9ffe1"; // 카카오 개발자센터에서 발급

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kakao 지도 시작하기</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing"></script>

    <style>
          body { margin: 0; padding: 0; height: 100vh; }
          #map { width: 100%; height: 100vh; }
        </style>
</head>
<body>
    <div id="map"></div>

    <script>
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};

		var map = new kakao.maps.Map(container, options);
	</script>
</body>
</html>
`;

    return (
        <View className="w-full h-full">
            <WebView
                className="w-full h-full"
                originWhitelist={['*']}
                source={{ html: html, baseUrl: "http://localhost" }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoad={() => console.log("WebView loaded")}
                onError={() => console.log("WebView error")}
                onMessage={(event) => console.log("WebView message", event)}
            />
        </View>
    );
}
