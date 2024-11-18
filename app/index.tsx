import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WelcomeScreen from './screen/auth/welcome';
import PLoginScreen from './screen/auth/plogin';
import RLoginScreen from './screen/auth/rlogin';
import ChooseScreen from './screen/auth/choose';
import Choose2Screen from './screen/auth/choose2';
import PRegScreen from './screen/auth/preg';
import RRegScreen from './screen/auth/rreg';
import HomeScreen from './screen/home';
import ProfileScreen from './screen/profile';
import ServiceScreen from './screen/service';
import MapScreen from './screen/order/map';
import OrderScreen from './screen/order/order';
import OrderDetailScreen from './screen/order/orderdetail';
import MyOrderScreen from './screen/myorder/myorder';
import MyOrderDeScreen from './screen/myorder/myorderde';
import MyOrderHisScreen from './screen/myorder/myorderhis';
import MyOrderHisDeScreen from './screen/myorder/myorderhisde';
import MyInviteScreen from './screen/invite/myinvite';
import MyInviteDeScreen from './screen/invite/myinvitede';
import OtherInviteScreen from './screen/invite/otherinvite';
import OtherInviteDeScreen from './screen/invite/otherinvitede';
import InviteMap from './screen/invite/invitemap';
import store from './(store)/';
import { Provider } from 'react-redux';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import "../global.css";
import { View, Pressable } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const CustomBackHeader = ({ navigation }: { navigation: any }) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      left: 15, // 控制距離左邊的距離
      top: 15, // 控制距離上方的距離
    }}
  >
    <Pressable 
      className='rounded-full'
      onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-circle" size={50} color="black" />
    </Pressable>
  </View>
);

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="進行中" component={MyOrderScreen} />
      <TopTab.Screen name="已結束" component={MyOrderHisScreen} />
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
          options={({ navigation }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: "transparent", // 設定 header 背景透明
            },
            headerTransparent: true, // 確保背景完全透明
            headerTitle: "", // 移除標題文字
            headerLeft: () => <CustomBackHeader navigation={navigation} />, // 傳遞 navigation
          })}
        />
        <Stack.Screen name="myorder"
          component={TopTabNavigator} 
          options={{ 
            headerShown: true,
            headerShadowVisible: false,
            title: "主頁",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="myorderde"
          component={MyOrderDeScreen} 
          options={{ 
            headerShown: true,
            title: "訂單管理",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="myorderhisde"
          component={MyOrderHisDeScreen} 
          options={{ 
            headerShown: true,
            title: "訂單管理",
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
        <Stack.Screen name="otherinvitede"
          component={OtherInviteDeScreen} 
          options={{ 
            headerShown: true,
            title: "別人邀請",
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="myinvite"
          component={TopTabNavigator2} 
          options={{ 
            headerShown: true,
            headerShadowVisible: false,
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
          options={({ navigation }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: "transparent", // 設定 header 背景透明
            },
            headerTransparent: true, // 確保背景完全透明
            headerTitle: "", // 移除標題文字
            headerLeft: () => <CustomBackHeader navigation={navigation} />, // 傳遞 navigation
          })}
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