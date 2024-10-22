import { Stack } from "expo-router";
import "../../global.css"
import store from '../(store)/index';
import { Provider } from 'react-redux';

const Layout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="choose" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default Layout;
