import { Stack } from "expo-router";
import "../../global.css"
import store from '../(store)/index';
import { Provider } from 'react-redux';

const Layout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="orderadd" options={{ 
            headerShown: true,
            title: "訂單新增",
          }} 
        />
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
    </Provider>
  );
};

export default Layout;