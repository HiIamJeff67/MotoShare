import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WelcomeScreen from './(auth)/welcome';
import PLoginScreen from './(auth)/plogin';
import RLoginScreen from './(auth)/rlogin';
import ChooseScreen from './(auth)/choose';
import Choose2Screen from './(auth)/choose2';
import PRegScreen from './(auth)/preg';
import RRegScreen from './(auth)/rreg';
import HomeScreen from './(root)/(tabs)/home';
import ProfileScreen from './(root)/(tabs)/profile';
import ServiceScreen from './(root)/(tabs)/service';
import MapScreen from './(root)/map';
import OrderScreen from './(root)/order';
import OrderDetailScreen from './(root)/orderdetail';
import MyOrderScreen from './(root)/myorder';
import store from './(store)/';
import { Provider } from 'react-redux';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import "../global.css";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="進行中" component={MyOrderScreen} />
      <TopTab.Screen name="已結束" component={ProfileScreen} />
    </TopTab.Navigator>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home Page"
        component={HomeScreen}
        options={{
          title: "主頁",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={24}
              color={focused ? "#3498db" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="service"
        component={ServiceScreen}
        options={{
          title: "服務",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="shopping-cart"
              size={24}
              color={focused ? "#3498db" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "我的",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={focused ? "#3498db" : "black"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Stack.Navigator>
        <Stack.Screen name="welcome" 
          component={WelcomeScreen} 
          options={{ 
              headerShown: false,
          }} 
        />
        <Stack.Screen name="myorder"
          component={TopTabNavigator} 
          options={{ 
            headerShown: true,
            title: "主頁",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="order" 
          component={OrderScreen}
          options={{ 
            headerShown: true,
            title: "主頁",
            headerTitleAlign: 'center',
          }}

        />
        <Stack.Screen name="orderdetail" 
          component={OrderDetailScreen} 
          options={{ 
            headerShown: true,
            title: "訂單",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="map" 
          component={MapScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="plogin" 
          component={PLoginScreen} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="rlogin" 
          component={RLoginScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="choose" 
          component={ChooseScreen} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="choose2" 
          component={Choose2Screen} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="preg" 
          component={PRegScreen} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="rreg" 
          component={RRegScreen} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen name="home" 
          component={TabNavigator}
          options={{ 
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </Provider>
  );
}