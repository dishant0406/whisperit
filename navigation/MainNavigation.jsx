import React from 'react'
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '../screens/ChatListScreen';
import { View } from 'react-native';
import ChatScreen from '../screens/ChatScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import back from '../assets/back.png'


const MainNavigation = () => {

  const TabNavigate = () => {
    return <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" options={{
        tabBarLabel: 'Chats',
        tabBarIcon: ({ color }) => <Ionicons name="ios-chatbubbles-outline" size={24} color={color} />
      }} component={ChatListScreen} />
      <Tab.Screen name="Chat2" options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color }) => <Ionicons name="ios-settings-outline" size={24} color={color} />
      }} component={ChatScreen} />
    </Tab.Navigator>
  }

  return (
    
        <Stack.Navigator>
          <Stack.Screen name="Tab" component={TabNavigate} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{
            //three dot context menu
            headerShown: true,
            headerTitle: '',
            headerTitleAlign: 'center',
            
            headerTitleStyle: {
              color: 'black',
              fontSize: 20,
              fontFamily:'regular'
            },

           headerBackImageSource : back,
           headerBackTitle:'',

            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <Ionicons name="ios-ellipsis-vertical-sharp" size={24} color="black" />
              </View>
            )

          }}/>
        </Stack.Navigator>
      
  )
}

export default MainNavigation