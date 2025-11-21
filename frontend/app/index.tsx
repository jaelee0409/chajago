import { useRef, useState } from "react";
import { Alert, View } from "react-native";
import { testConnection } from "./api";
import FloatingActionButton from "./components/FloatingActionButton";
import KakaoMapWebView, { KakaoMapWebViewHandle } from "./components/KakaoMapWebView";

export default function HomePage() {
  const [message, setMessage] = useState("");

  const mapRef = useRef<KakaoMapWebViewHandle>(null);

  const testBackend = async () => {
    const result = await testConnection();
    setMessage(result);
    console.log(result);
  };

  const handleAddTrashcan = () => {
    console.log('Adding trashcan at:');
    mapRef.current?.addMarkerToMap('trashcan');
  };

  const handleAddRestroom = () => {
    console.log('Adding restroom at:');
    mapRef.current?.addMarkerToMap('restroom');
  };

  const handleMarkerAdded = (marker: { lat: number; lng: number; type: string }) => {
    console.log('Marker added:', marker);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <KakaoMapWebView ref={mapRef} onMarkerAdded={handleMarkerAdded} />

      <FloatingActionButton onAddTrashcan={handleAddTrashcan} onAddRestroom={handleAddRestroom} />
    </View>
  );
};
