import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WelcomeScreen from './screen/welcome';
import PLoginScreen from './screen/plogin';
import RLoginScreen from './screen/rlogin';
import ChooseScreen from './screen/choose';
import Choose2Screen from './screen/choose2';
import PRegScreen from './screen/preg';
import RRegScreen from './screen/rreg';
import HomeScreen from './screen/home';
import ProfileScreen from './screen/profile';
import ServiceScreen from './screen/service';
import MapScreen from './screen/map';
import OrderScreen from './screen/order';
import OrderDetailScreen from './screen/orderdetail';
import MyOrderScreen from './screen/myorder';
import MyInviteScreen from './screen/myinvite';
import MyInviteDeScreen from './screen/myinvitede';
import OtherInviteScreen from './screen/otherinvite';
import InviteMap from './screen/invitemap';
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

const TopTabNavigator2 = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="我的邀請" component={MyInviteScreen} />
      <TopTab.Screen name="別人邀請" component={OtherInviteScreen} />
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
        <Stack.Screen name="invitemap"
          component={InviteMap} 
          options={{ 
            headerShown: false,
            title: "主頁",
            headerTitleAlign: 'center',
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
        <Stack.Screen name="myinvitede"
          component={MyInviteDeScreen} 
          options={{ 
            headerShown: true,
            title: "我的邀請",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="myinvite"
          component={TopTabNavigator2} 
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