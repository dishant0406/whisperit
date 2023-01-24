import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatListScreen from '../screens/ChatListScreen';
import { Image, View } from 'react-native';
import ChatScreen from '../screens/ChatScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import back from '../assets/back.png'
import SettingPage from '../components/Auth/SettingsPage';
import NewChatScreen from '../screens/NewChatScreen';
import { collection, doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { auth, firebaseHelper } from '../utils/firebase/firebase';
import { useUsersChatsStore } from '../utils/zustand/zustand';


const TabNavigate = () => {
  return <Tab.Navigator>
    <Tab.Screen name="Home" options={{
      tabBarLabel: 'Chats',
      headerTitle:'',
      tabBarIcon: ({ color }) => <Ionicons name="ios-chatbubbles-outline" size={24} color={color} />
    }} component={ChatListScreen} />
    <Tab.Screen name="Settings" options={{
      tabBarLabel: 'Settings',
      headerShown:true,
      headerTitleAlign:'center',
      headerTitleStyle:{
        color:'black',
        fontSize:24,
        fontFamily:'semi-bold'
      },
      //header background color to #f4f4f4
      headerStyle:{
        backgroundColor:'#f4f4f4'
      },
      headerTitle:'Settings',
      headerShadowVisible:false,
      tabBarIcon: ({ color }) => <Ionicons name="ios-settings-outline" size={24} color={color} />,

    }} component={SettingPage} />
  </Tab.Navigator>
}


const MainNavigation = () => {
  const unsubarray = []
  const {setUsersChats, usersChats} = useUsersChatsStore()

  useEffect(()=>{
    const app = firebaseHelper()
    //save the userid fullname email photo to collection users with id as userid
    const db = getFirestore(app);
    const unsub = onSnapshot(doc
      (db, "usersChats", auth.currentUser.uid), (doc1) => {
      const chatIdsData = doc1.data()  || {}
      const chatIds = Object.values(chatIdsData)
      const chatDataLocal = []
      const usersData = []

      chatIds.forEach(chatId=>{
        const unsub2 = onSnapshot(doc(db, "chats", chatId), (doc2) => {
          const chatData = doc2.data() || {}
          const chat = {id:doc2.id,...chatData}
          chatDataLocal.push(chat)
          chat.users.forEach(async (e)=>{
            if(e!==auth.currentUser.uid){
              const chatref = collection(db, "users");
              const userDoc = doc(chatref, e);
              const userDocData = await getDoc(userDoc);
              const userData = userDocData.data() || {}
              usersData.push(userData)
            }
          })
        })
        unsubarray.push(unsub2)

        }
      )

      setUsersChats(usersData)


       
    });

    unsubarray.push(unsub)

    return ()=>{
      unsubarray.forEach(unsub=>unsub())
    }
  },[])

  return (
    
        <Stack.Navigator>
          <Stack.Group>
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
              headerBackTitle:'',
              headerBackTitleVisible:false,

                headerRight: () => (
                  <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <Ionicons name="ios-ellipsis-vertical-sharp" size={24} color="black" />
                  </View>
                ),
                headerStyle: {
                  backgroundColor: '#f4f4f4',
                },
                headerShadowVisible: false,

              }}/>
          </Stack.Group>
          <Stack.Group screenOptions={{
            presentation: 'containedModal', 
          }}>
            <Stack.Screen name="AddChat" component={NewChatScreen} /> 
          </Stack.Group>
        </Stack.Navigator>
      
  )
}

export default MainNavigation