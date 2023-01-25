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
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { auth, firebaseHelper } from '../utils/firebase/firebase';
import { useUsersChatsStore, useMessagesStore } from '../utils/zustand/zustand';
import ProgressLoader from 'rn-progress-loader';


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
  const [loading, setLoading] = React.useState(false)
  const unsubarray = []
  const {setUsersChats, usersChats} = useUsersChatsStore()
  const {setMessages} = useMessagesStore()

  useEffect(()=>{
    
    const app = firebaseHelper()
    //save the userid fullname email photo to collection users with id as userid
    const db = getFirestore(app);
    setLoading(true)

    const unsub = onSnapshot(doc
      (db, "usersChats", auth.currentUser.uid), async (doc1) => {
        const chatDataLocal = []
        let usersData = []
        let chatsMessageData = {}
        const chatIdsData = doc1.data()  || {}
        const chatIds = Object.values(chatIdsData)
        if(chatIds.length<1){
          setUsersChats([])
          setLoading(false)
        }
      
      for (let i = 0; i < chatIds.length; i++) {
        const chat = chatIds[i];
        const unsub2 = onSnapshot(doc(db, "messages", chat), async (doc2) => {
          let chatData = doc2.data()||{}
          const chatMessage = Object.values(chatData)
          chatsMessageData[chat] = chatMessage
          setMessages(chatsMessageData)
        })

        

        unsubarray.push(unsub2)

        
      }
      

      for (let i = 0; i < chatIds.length; i++) {
        const chat = chatIds[i];
        const unsub2 = onSnapshot(doc(db, "chats", chat), async (doc2) => {
          let chatData = doc2.data() || {}
          chatData = {id:chat, ...chatData}
          chatDataLocal.push(chatData)
          

          for (let j = 0; j < chatData?.users?.length; j++) {
            const user = chatData.users[j];
            if(user!==auth.currentUser.uid){
              const chatref = collection(db, "users");
              const userDoc = doc(chatref, user);
              const userDocData = await getDoc(userDoc);
              const userData = userDocData.data() || {}
              // console.log('userdata',userData)
              
              //check if user is already in the array
              usersData =  usersData.filter((user)=>user.userid!==userData.userid)
              usersData.push(
                {...userData, key:chat, latestMessage:chatData.latestMessage, updatedAt:chatData.updatedAt}
              )
              //sort usersData according to usersData.updatedAt iso string the new should be on top
              usersData.sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))
              console.log(usersData)
            }
          }
          // console.log(usersData)
          setUsersChats(usersData)
          setLoading(false)
          
        })

        unsubarray.push(unsub2)
        
      }



      // const myChatsref = collection(db, 'chats')
      // const myChats = await getDocs(myChatsref)
      // myChats.forEach(async (doc3) => {
      //   const chatData = doc3.data() || {}
      //   const chat = {id:doc3.id,...chatData}
      //   chatDataLocal.push(chat)

      //   for (let j = 0; j < chatData.users.length; j++) {
      //     const user = chatData.users[j];
      //     if(user!==auth.currentUser.uid){
      //       const chatref = collection(db, "users");
      //       const userDoc = doc(chatref, user);
      //       const userDocData = await getDoc(userDoc);
      //       const userData = userDocData.data() || {}
      //       console.log('userdata',userData)
      //       // usersData.push(userData)
      //     }
      //   }
      // });

     

      
       
    });

   
    

    unsubarray.push(unsub)

    return ()=>{
      unsubarray.forEach(unsub=>{
        unsub()
      })
    }
  },[])

  if(loading){
    return (
      <ProgressLoader
                visible={loading}
      
                color={"#FFFFFF"} />
    )
  }

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