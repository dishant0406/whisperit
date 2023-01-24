import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../utils/firebase/firebase';


const CustomHeaderButton = props =>{
  return (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={22} color={props.color??'#464c52'} />
  )
}

const ChatListScreen = (props) => {

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item style={{ padding:5,paddingHorizontal:0, marginRight:10,borderRadius:10, backgroundColor:'#fff'}} title='add' iconName='md-create-outline' onPress={() => props.navigation.navigate('AddChat')}/>
        </HeaderButtons>

      ),
      headerTitle:'Chats',
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

    });
    })

    useEffect(()=>{
      //userid from the params
      const userid = props.route?.params?.userid
      if(userid){
        const chatusers = [userid, auth.currentUser.uid]
        props.navigation.navigate('Chat',{chatusers})
      }
    },[props.route?.params])

  return (
    <View style={styles.container}>
      <Button title='Chat' onPress={() => props.navigation.navigate('Chat')}/>
    </View>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})