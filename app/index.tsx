import React from 'react';
import { Text, Pressable } from 'react-native';

export default function App() {
  return (
    <Pressable 
      className="bg-blue-500 p-4 rounded-lg items-center justify-center"
      onPress={() => alert('Button Pressed!')}
    >
      <Text className="text-white text-lg font-bold">Press Me</Text>
    </Pressable>
  );
}