import React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, ActivityIndicator } from 'react-native';
import useLocation from '../hooks/useLocation';

export default function KakaoMapWebView() {
    const { location, error, isLoading } = useLocation();

    const KAKAO_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_API_KEY;

    const getMapHTML = () => {
        let centerLat = 37.5665; // 기본값: 서울
        let centerLng = 126.9780;

        if (location) {
            centerLat = location.coords.latitude;
            centerLng = location.coords.longitude;
        }

        return `
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
		var mapContainer = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(${centerLat}, ${centerLng}),
			level: 3
		};

		var map = new kakao.maps.Map(mapContainer, options);

        var content = '<div style="width: 12px; height: 12px; background: red; border-radius: 50%; border: 1px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>';
        var position = new kakao.maps.LatLng(${centerLat}, ${centerLng});
        
        var customOverlay = new kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: 0.5 
        });

        customOverlay.setMap(map);  

	</script>
</body>
</html>
`;
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text>현재 위치를 찾는 중...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View className="w-full h-full">
            <WebView
                className="w-full h-full"
                originWhitelist={['*']}
                source={{ html: getMapHTML(), baseUrl: "http://localhost" }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoad={() => console.log("WebView loaded")}
                onError={() => console.log("WebView error")}
                onMessage={(event) => console.log("WebView message", event)}
            />
        </View>
    );
}
