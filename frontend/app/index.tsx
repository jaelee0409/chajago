import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { testConnection } from "./api";

import KakaoMapWebView from "../components/KakaoMapWebView";

export default function HomePage() {
  const [message, setMessage] = useState("");

  const testBackend = async () => {
    const result = await testConnection();
    setMessage(result);
    console.log(result);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <KakaoMapWebView />
    </View>
  );
};
