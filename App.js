import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './Screens/Common/SplashScreen';
import HomeScreen from './Screens/User/HomeScreen';
import LoginScreen from './Screens/Common/LoginScreen';
import SignupScreen from './Screens/Common/SignupScreen';
import NotificationScreen from './Screens/User/NotificationScreen';
import TicketScreen from './Screens/User/TicketScreen';
import CategoryScreen from './Screens/User/CategoryScreen';
import ProfileScreen from './Screens/User/ProfileScreen';
import AnimatedTabBar from './component/AnimatedTabBar';
import TickerDetailScreen from './Screens/User/TicketDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Ticket" component={TicketScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="TicketDetail" component={TickerDetailScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setInitialRoute(userToken ? 'MainTabs' : 'Login');
      
      // Delay the splash screen for 3 seconds before hiding it
      setTimeout(() => {
        setSplashVisible(false);
      }, 3000);
    };

    checkLoginStatus();
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
