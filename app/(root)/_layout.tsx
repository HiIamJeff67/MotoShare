import { Stack } from "expo-router";
import "../../global.css"

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="orderdetail" options={{ 
          headerShown: true,
          title: "訂單詳情",
        }} 
      />
      <Stack.Screen name="(tabs)" options={{ 
          headerShown: false,
          title: "訂單",
        }}
      />
    </Stack>
  );
};

export default Layout;