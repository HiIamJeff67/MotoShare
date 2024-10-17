import { Tabs } from "expo-router";
import "../../../global.css"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home"
        options={{
          title: "主頁",
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome name="home" size={24} color="black" />
          ),
        }}  
      />
      <Tabs.Screen name="order"
        options={{
          title: "訂單",
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarIcon: () => (
            <FontAwesome name="shopping-cart" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen name="profile"
        options={{
          title: "我的",
          headerShown: false,
          tabBarIcon: () => (
            <MaterialCommunityIcons name="account" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
