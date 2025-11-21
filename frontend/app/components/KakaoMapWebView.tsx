import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, ActivityIndicator } from 'react-native';
import useLocation from '../hooks/useLocation';

export interface KakaoMapWebViewHandle {
    addMarkerToMap: (type: 'trashcan' | 'restroom') => void;
}

interface KakaoMapWebViewProps {
    onMarkerAdded?: (marker: { lat: number; lng: number; type: string }) => void;
}

const KakaoMapWebView = forwardRef<KakaoMapWebViewHandle, KakaoMapWebViewProps>(({ onMarkerAdded }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);

    const { location, error, isLoading } = useLocation();

    const KAKAO_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_API_KEY;

    const handleWebViewMessage = (event: any) => {
        console.log('📨 Received from WebView:', event.nativeEvent.data);

        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('📨 Parsed message:', data);

            if (data.type === 'MAP_READY') {
                console.log('🗺️ Map is ready!');
            }

            if (data.type === 'MARKER_ADDED' && onMarkerAdded) {
                console.log('📍 Marker added callback called');
                onMarkerAdded(data.payload);
                setIsSelectingLocation(false);
            }

            if (data.type === 'MARKER_PLACED') {
                console.log('📍 Marker placed on map');
                setIsSelectingLocation(false);
            }

            if (data.type === 'SELECTION_CANCELLED') {
                console.log('❌ Selection cancelled');
                setIsSelectingLocation(false);
            }
        } catch (error) {
            console.log('❌ Failed to parse message:', event.nativeEvent.data);
        }
    };

    useImperativeHandle(ref, () => ({
        addMarkerToMap: (type: 'trashcan' | 'restroom') => {
            console.log('🎯 Enable add marker mode:', type);
            setIsSelectingLocation(true);

            const script = `
                if (typeof window.enableAddMarkerMode === 'function') {
                    window.enableAddMarkerMode('${type}');
                } else {
                    console.error('enableAddMarkerMode function not found');
                }
            `;

            webViewRef.current?.injectJavaScript(script);
        }
    }));

    const getMapHTML = () => {
        let centerLat = 37.5665; // 기본값: 서울
        let centerLng = 126.9780;

        if (location) {
            centerLat = location.coords.latitude;
            centerLng = location.coords.longitude;
        }

        // 쓰레기통 - "T" 텍스트 (더 작게)
        const trashcanSVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="16" cy="16" r="14" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>' +
            '<text x="16" y="19" text-anchor="middle" fill="#475569" font-size="8" font-weight="bold">쓰레기통</text>' +
            '</svg>'
        );

        // 화장실 - "W" 텍스트 (더 작게)
        const restroomSVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="16" cy="16" r="14" fill="#7dd3fc" stroke="#0ea5e9" stroke-width="1"/>' +
            '<text x="16" y="19" text-anchor="middle" fill="#0369a1" font-size="8" font-weight="bold">화장실</text>' +
            '</svg>'
        );

        return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kakao 지도</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing"></script>

    <style>
          body { margin: 0; padding: 0; height: 100vh; }
          #map { width: 100%; height: 100vh; }
          
          .custom-overlay {
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            gap: 8px;
            align-items: center;
            pointer-events: auto; /* Ensure clicks are captured */
          }
          .confirm-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
          }
          .cancel-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
          }

          /* Marker Menu Styles */
          .marker-menu-overlay {
            background: white;
            padding: 8px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            gap: 8px;
            align-items: center;
            pointer-events: auto;
          }
          .menu-btn {
            background: #f1f5f9;
            border: none;
            width: 72px;
            height: 36px;
            border-radius: 18px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
          }
          .menu-btn:active {
            background: #e2e8f0;
          }
          .menu-btn.report {
            background: #fee2e2;
          }
          .close-menu-btn {
            background: transparent;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #94a3b8;
            margin-left: 4px;
          }
          .close-menu-btn:active {
            background: #f1f5f9;
            color: #475569;
          }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
		var map;
        var isAddingMarker = false;
        var hasPlacedMarker = false;
        var addingMarkerType = null;
        var tempMarker = null;
        var tempOverlay = null;
        
        var activeMenuOverlay = null;
        var activeMenuMarkerPosition = null;
        
        // React Native와 통신하기 위한 함수
        function sendToReactNative(message) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(message));
            }
        }

        window.enableAddMarkerMode = function(type) {
            isAddingMarker = true;
            hasPlacedMarker = false;
            addingMarkerType = type;
            console.log('Enabled add marker mode:', type);
        }

        window.closeMarkerMenu = function() {
            if (activeMenuOverlay) {
                activeMenuOverlay.setMap(null);
                activeMenuOverlay = null;
            }
        }

        window.showMarkerMenu = function(marker, type) {
            // Close existing menu if any
            window.closeMarkerMenu();

            activeMenuMarkerPosition = marker.getPosition();

            var content = '<div class="marker-menu-overlay" onclick="event.stopPropagation()">' +
                '<button onclick="handleMarkerAction(\\'thumbs-up\\')" class="menu-btn">👍 확인됨</button>' +
                '<button onclick="handleMarkerAction(\\'thumbs-down\\')" class="menu-btn">👎 없어짐</button>' +
                '<button onclick="handleMarkerAction(\\'report\\')" class="menu-btn report">🚨 신고</button>' +
                '<div style="width: 1px; height: 20px; background: #e2e8f0; margin: 0 2px;"></div>' +
                '<button onclick="closeMarkerMenu()" class="close-menu-btn">✕</button>' +
                '</div>';

            activeMenuOverlay = new kakao.maps.CustomOverlay({
                position: marker.getPosition(),
                content: content,
                yAnchor: 2.5, // Show above the marker
                clickable: true
            });
            
            activeMenuOverlay.setMap(map);
        }

        window.handleMarkerAction = function(action) {
            console.log('Marker action:', action);
            
            var payload = {
                action: action
            };

            if (activeMenuMarkerPosition) {
                payload.lat = activeMenuMarkerPosition.getLat();
                payload.lng = activeMenuMarkerPosition.getLng();
            }

            sendToReactNative({
                type: 'MARKER_ACTION',
                payload: payload
            });
            
            // Close menu after action
            if (activeMenuOverlay) {
                activeMenuOverlay.setMap(null);
                activeMenuOverlay = null;
            }
        }

        window.confirmMarker = function(event) {
            if (event) event.stopPropagation();
            if (!tempMarker || !addingMarkerType) return;
            
            var position = tempMarker.getPosition();
            
            sendToReactNative({
                type: 'MARKER_ADDED',
                payload: {
                    lat: position.getLat(),
                    lng: position.getLng(),
                    type: addingMarkerType
                }
            });

            // Clean up UI but KEEP the marker
            if (tempMarker) {
                tempMarker.setDraggable(false); // Make it fixed
                
                // Add click listener for the menu
                var marker = tempMarker; // Capture closure
                var markerType = addingMarkerType;
                
                kakao.maps.event.addListener(marker, 'click', function() {
                    showMarkerMenu(marker, markerType);
                });
            }
            
            if (tempOverlay) tempOverlay.setMap(null); // Remove the buttons
            
            // Reset state
            tempMarker = null; // Forget the reference
            tempOverlay = null;
            isAddingMarker = false;
            hasPlacedMarker = false;
            addingMarkerType = null;
        }

        window.cancelMarker = function(event) {
            if (event) event.stopPropagation();
            
            if (tempMarker) tempMarker.setMap(null);
            if (tempOverlay) tempOverlay.setMap(null);
            tempMarker = null;
            tempOverlay = null;
            isAddingMarker = false;
            hasPlacedMarker = false;
            addingMarkerType = null;
            
            sendToReactNative({ type: 'SELECTION_CANCELLED' });
        }

        kakao.maps.load(function() {
            var mapContainer = document.getElementById('map');
            var options = {
                center: new kakao.maps.LatLng(${centerLat}, ${centerLng}),
                level: 3
            };

            map = new kakao.maps.Map(mapContainer, options);
            
            // 현재 위치 마커
            var content = '<div style="width: 12px; height: 12px; background: red; border-radius: 50%; border: 1px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>';
            var position = new kakao.maps.LatLng(${centerLat}, ${centerLng});
            
            var customOverlay = new kakao.maps.CustomOverlay({
                position: position,
                content: content,
                yAnchor: 0.5 
            });
            customOverlay.setMap(map);

            // 지도 클릭 이벤트 리스너
            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                // Close active menu if exists
                if (activeMenuOverlay) {
                    activeMenuOverlay.setMap(null);
                    activeMenuOverlay = null;
                }

                // 마커 추가 모드가 아니거나, 이미 마커를 놓았으면 무시
                if (!isAddingMarker || hasPlacedMarker) return;

                var latlng = mouseEvent.latLng;

                // Remove existing temp marker/overlay (just in case)
                if (tempMarker) tempMarker.setMap(null);
                if (tempOverlay) tempOverlay.setMap(null);

                // Create marker
                tempMarker = new kakao.maps.Marker({
                    position: latlng,
                    draggable: true
                });
                
                // Set image based on type
                if (addingMarkerType === 'trashcan') {
                     const trashcanSVG = '${trashcanSVG}';
                     tempMarker.setImage(new kakao.maps.MarkerImage(trashcanSVG, new kakao.maps.Size(28, 28)));
                } else {
                     const restroomSVG = '${restroomSVG}';
                     tempMarker.setImage(new kakao.maps.MarkerImage(restroomSVG, new kakao.maps.Size(28, 28)));
                }
                tempMarker.setMap(map);

                // Create overlay
                // Note: event.stopPropagation() is crucial here
                var content = '<div class="custom-overlay" onclick="event.stopPropagation()">' +
                    '<button onclick="confirmMarker(event)" class="confirm-btn">등록</button>' +
                    '<button onclick="cancelMarker(event)" class="cancel-btn">취소</button>' +
                    '</div>';

                tempOverlay = new kakao.maps.CustomOverlay({
                    position: latlng,
                    content: content,
                    yAnchor: 2.2, // Position above the marker
                    clickable: true // Allow clicks on the overlay
                });
                tempOverlay.setMap(map);

                // Update overlay position when marker is dragged
                kakao.maps.event.addListener(tempMarker, 'dragend', function() {
                    tempOverlay.setPosition(tempMarker.getPosition());
                });
                
                // Mark as placed so subsequent map clicks don't move it
                hasPlacedMarker = true;
                sendToReactNative({ type: 'MARKER_PLACED' });
            });

            // 지도 준비 완료 알림
            sendToReactNative({ type: 'MAP_READY' });
        });
    </script>
</body>
</html>`;
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
        <View className="w-full h-full relative">
            <WebView
                ref={webViewRef}
                className="w-full h-full"
                originWhitelist={['*']}
                source={{ html: getMapHTML(), baseUrl: "http://localhost" }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoad={() => console.log("WebView loaded")}
                onError={() => console.log("WebView error")}
                onMessage={handleWebViewMessage}
            />

            {isSelectingLocation && (
                <View className="absolute top-12 left-0 right-0 items-center justify-center z-10">
                    <View className="bg-slate-900 px-6 py-3 rounded-full shadow-lg border border-white/20">
                        <Text className="text-white font-bold text-base">📍 위치를 클릭해주세요!</Text>
                    </View>
                </View>
            )}
        </View>
    );
});

export default KakaoMapWebView;
