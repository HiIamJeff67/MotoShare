import { Stack } from "expo-router";
import "../../global.css"

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
