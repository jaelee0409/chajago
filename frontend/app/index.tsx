// In your frontend index.tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { testConnection } from "./api";

export default function Index() {
  const [message, setMessage] = useState("");

  const testBackend = async () => {
    const result = await testConnection();
    setMessage(result);
    console.log(result);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Pressable
        className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600"
        onPress={testBackend}
      >
        <Text className="text-white font-bold text-lg">Test Backend</Text>
      </Pressable>
      <Text className="mt-4 text-lg text-gray-800">{message}</Text>
      <Text className="mt-2 text-gray-500">HELLO</Text>
    </View>
  );
};
