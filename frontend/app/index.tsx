// In your frontend index.tsx
import { Button, View, Text } from "react-native";
import { testConnection } from "../api";
import { useState } from "react";

const Index = () => {
  const [message, setMessage] = useState("");

  const testBackend = async () => {
    const result = await testConnection();
    setMessage(result); // Should show "Backend connected!"
  };

  return (
    <View>
      <Button title="Test Backend" onPress={testBackend} />
      <Text>{message}</Text>
    </View>
  );
};
