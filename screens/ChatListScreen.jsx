import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../utils/firebase/firebase';
import { useUsersChatsStore, useSelectedUserStore } from '../utils/zustand/zustand';


const CustomHeaderButton = props =>{
  return (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={22} color={props.color??'#464c52'} />
  )
}

const ChatListScreen = (props) => {
  const {usersChats} = useUsersChatsStore()
  const {setSelectedUser} = useSelectedUserStore()

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
      <View style={{flex:1, width:'100%', alignItems:'center'}}>
                <FlatList style={{width:'90%'}} data={usersChats} renderItem={({item})=>{
                  return (
                    <TouchableOpacity onPress={()=>{
                      const chatusers = [item.userid, auth.currentUser.uid]
                      const chatid = item.key
                      setSelectedUser(item)
                      props.navigation.navigate('Chat',{chatusers, chatid})
                    }} activeOpacity={0.8} style={styles.useritem}>
                      <View style={styles.useravatar}>
                        <Image source={{uri:item.photo}} style={styles.avatar}/>
                      </View>
                      <View style={styles.userinfo}>
                        <Text numberOfLines={1} style={styles.username}>{item.fullname}</Text>
                        <Text numberOfLines={1} style={styles.useremail}>{item.latestMessage || item.email}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }} keyExtractor={item=>item.userid}/>
              </View>
    </View>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
  input:{
    fontSize:18,
    fontFamily:'semi-bold',
    padding:5,
    marginVertical:10,
    backgroundColor:'#fff',
    height:50,
    borderRadius:10,
    paddingLeft:50,
    paddingTop:10
  },
  icon:{
    position:'absolute',
    top:20,
    left:10,
    zIndex:1
  },
  notfound:{
    width:'80%',
    marginTop:-70,
    height:300,
    backgroundColor:'#fff',
    borderRadius:25,
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    justifyContent:'flex-start',
    paddingTop:40,
    alignItems:'center'

  },
  useritem:{
    width:'100%',
    height:80,
    backgroundColor:'#fff',
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10,
    //shadow
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
  },
  useravatar:{
    width:'20%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:10
  },
  avatar:{
    width:60,
    height:60,
    borderRadius:30
  },
  userinfo:{
    width:'80%',
    height:'100%',
    justifyContent:'center',
    paddingLeft:10
  },
  username:{
    fontSize:18,
    fontFamily:'semi-bold',
    color:'#000',
    width:'80%'
  },
  useremail:{
    fontSize:16,
    fontFamily:'regular',
    color:'#989898',
    width:'80%'
  }


})