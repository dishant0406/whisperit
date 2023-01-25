import { View, Text, StyleSheet, Image, TextInput, Dimensions, ScrollView, ScrollViewBase, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import avatar from '../assets/avatar.png'
import { useSelectedUserStore, useMessagesStore } from '../utils/zustand/zustand';
import down from '../assets/thumbdown.png'
import { auth, firebaseHelper } from '../utils/firebase/firebase';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import { createChat, sendTextMessage } from '../utils/authentication/createChat';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import * as Clipboard from 'expo-clipboard';
import { renderers } from 'react-native-popup-menu';
const { SlideInMenu } = renderers;


const NotAvailable = ({title, image, desc})=>{
  return <ScrollView style={{flex:1,width:'100%', 
  height:Dimensions.get('window').height-200,
  }}>
    <View style={{flex:1, justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-200}}>
            <View style={styles.notfound}>
              <Text style={{fontSize:24, fontFamily:'semi-bold', color:'#101010'}}>{title}</Text>
              <Text style={{fontSize:20, fontFamily:'semi-bold', color:'#9a9691', textAlign:'center', width:'80%'}}>{desc}</Text>
              <Image source={image} style={{width:100, height:100}}/>
            </View>
        </View>
  </ScrollView>
}

const SenderChat = ({text, time})=>{

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
  };

  const menuRef = useRef(null)
  const id = useRef(uuid.v4())
  return (
    <View style={styles.senderchatholder}>
        <Menu renderer={SlideInMenu}  name={id.current} ref={menuRef}>
        <TouchableWithoutFeedback onLongPress={()=>menuRef.current.props.ctx.menuActions.openMenu(id.current)}>
          <View style={styles.senderchat}>
            <Text style={styles.chatText}>{text}</Text>
            <View style={{width:'100%', alignItems:'flex-end'}}>
              <Text style={{fontSize:10, color:'#9a9691', fontFamily:'medium'}}>
                {
                  new Date(time).getHours() > 12 ?
                  `${new Date(time).getHours()-12}:${new Date(time).getMinutes()} PM`:
                  `${new Date(time).getHours()}:${new Date(time).getMinutes()} AM`
                }
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <MenuTrigger  />
      <MenuOptions  >
        <MenuOption style={{backgroundColor:'#f4f4f4', borderBottomColor:'red'}} onSelect={copyToClipboard} >
          <Text style={{height:50, paddingTop:10, alignItems:'center', justifyContent:'center', textAlign:'center', fontFamily:'medium', fontSize:18}}>Copy</Text>
        </MenuOption>
        <MenuOption style={{backgroundColor:'#f4f4f4', borderBottomColor:'red'}} onSelect={() => alert(`Delete`)} >
          <Text style={{height:50, paddingTop:10, alignItems:'center', justifyContent:'center', textAlign:'center', fontFamily:'medium', fontSize:18}}>Save</Text>
        </MenuOption>
      </MenuOptions>
  </Menu>
    </View>
    
  )
}

const RecieverChat = ({text, time})=>{

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
  };

  const menuRef = useRef(null)
  const id = useRef(uuid.v4())
  return (
    <View style={styles.recieverchatholder}>
        <Menu renderer={SlideInMenu}  name={id.current} ref={menuRef}>
        <TouchableWithoutFeedback onLongPress={()=>menuRef.current.props.ctx.menuActions.openMenu(id.current)}>
          <View style={styles.recieverchat}>
            <Text style={styles.chatText}>{text}</Text>
            <View style={{width:'100%', alignItems:'flex-end'}}>
              <Text style={{fontSize:10, color:'#9a9691', fontFamily:'medium'}}>
                {
                  new Date(time).getHours() > 12 ?
                  `${new Date(time).getHours()-12}:${new Date(time).getMinutes()} PM`:
                  `${new Date(time).getHours()}:${new Date(time).getMinutes()} AM`
                }
              </Text>
            </View>
          </View>
          
        </TouchableWithoutFeedback>
        <MenuTrigger  />
      <MenuOptions  >
        <MenuOption style={{backgroundColor:'#f4f4f4', borderBottomColor:'red'}} onSelect={copyToClipboard} >
          <Text style={{height:50, paddingTop:10, alignItems:'center', justifyContent:'center', textAlign:'center', fontFamily:'medium', fontSize:18}}>Copy</Text>
        </MenuOption>
        <MenuOption style={{backgroundColor:'#f4f4f4', borderBottomColor:'red'}} onSelect={() => alert(`Delete`)} >
          <Text style={{height:50, paddingTop:10, alignItems:'center', justifyContent:'center', textAlign:'center', fontFamily:'medium', fontSize:18}}>Save</Text>
        </MenuOption>
      </MenuOptions>
  </Menu>
    </View>
    
  )
}

const ChatScreen = (props) => {
  const [chatid, setChatId] = useState(props.route?.params?.chatid)
  const {selectedUser} = useSelectedUserStore()
  const [chatUsers, setChatUsers] = useState([])
  const {messages} = useMessagesStore()
  const [chatMessages, setChatMessages] = useState([])
  const scrollref = useRef(null)

  useEffect(()=>{
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{ flexDirection: 'row', marginLeft: 10, padding:5,paddingHorizontal:6, backgroundColor:'#fff', borderRadius:10 }}>
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      ),
    })
  },[])

  //chatusers from params
  const chatusers = props.route?.params?.chatusers

  useEffect(()=>{
    if(chatusers){
      setChatUsers(chatusers)
    }

    

  },[props.route?.params])

  useEffect(()=>{
    if(chatid){
      let mymessages = messages[chatid]
      if(mymessages){
        //sort them according to messages.createdAt ISO string date
        mymessages.sort((a,b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        setChatMessages(mymessages)
        // if(scrollref){
        //   scrollref.current.scrollToEnd({animated:true})
        // }
      }
      
    }
  },[messages[chatid], chatid])

  const handleSend = async ()=>{
    let newchatid = undefined;
   if(!chatid){
    newchatid = await createChat(auth.currentUser.uid, chatUsers)
    setChatId(newchatid)
  }
    await sendTextMessage(newchatid || chatid, auth.currentUser.uid, messageText)
    setMessageText('')

  }

  

  const [messageText, setMessageText] = useState('')
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={90}>
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.titleheader}>
          <View style={styles.icon}>
              <Image source={selectedUser.photo ?{uri:selectedUser.photo}: avatar} style={styles.avatar}/>
            </View>
            <View style={styles.headertitle}>
              <Text style={styles.headername}>{selectedUser.fullname || 'User'}</Text>
              <Text style={styles.status}>Online</Text>
            </View>
          </View>
          <TouchableOpacity  onPress={()=>console.log('search')} style={styles.headericons}>
            <Feather name="search" size={24} color="#5f6368" />
          </TouchableOpacity>
      </View>
      {chatid && <ScrollView onContentSizeChange={()=>scrollref.current.scrollToEnd()} ref={scrollref} scrollEnabled={true} style={styles.body}>
       
       {
          chatMessages?.map((item, index)=>{
            if(item.createdBy === auth.currentUser.uid){
              return <SenderChat key={item.createdAt} time={item.createdAt} text={item.message}/>
            }else{
              return <RecieverChat key={item.createdAt} time={item.createdAt} text={item.message}/>
            }
          }
          )
       }
      </ScrollView>}
      {!chatid && <NotAvailable title='Start whispering...' image={down} desc='You have no chat with this user, write a new message to chat'/>}
        
        

      <View  style={styles.footer}>
        <TouchableOpacity onPress={()=>console.log('attach')} style={styles.attach}>
          <Ionicons name="ios-attach-outline" size={28} color="#62666b" />
        </TouchableOpacity>
        <View style={styles.inputcont}>
          <View>
            <TextInput multiline={true}  value={messageText} onChangeText={(e)=>setMessageText(e)} style={styles.input} placeholder='Message...'/>
          </View>
          <TouchableOpacity onPress={()=>console.log('sticker')} style={styles.sticker}>
            <MaterialCommunityIcons name="sticker-circle-outline" size={24} color="#989b9d" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={messageText!==''?handleSend:()=>{}} style={styles.mic}>
          {messageText===''?<Ionicons name="ios-mic-outline" size={28} color="#62666b" />:
          <Ionicons name="ios-send-outline" size={28} color="#62666b" />}
        </TouchableOpacity>
      </View>

      
    </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    width:'100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    //bottom shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  footer: {
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    width:'100%',
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    //top shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,


  },
  headericons:{
    marginRight:20
  },
  titleheader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 60,
    height: 60,
    backgroundColor: '#bfe2ff',
    borderRadius: 30,
    marginLeft:20,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  headertitle: {
    marginLeft: 20,
  },
  headername: {
    fontSize: 20,
    fontFamily: 'bold'
  },
  status: {
    fontSize: 18,
    marginTop:'-2%',
    fontFamily: 'regular',
    color:'#63c953'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  input: {
    minHeight: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 50,
    paddingVertical:10,
    marginVertical:10,
    fontFamily:'regular',
    fontSize: 16,
    width: 270,
    textAlignVertical:'center',
    paddingTop:15

  },
  inputcont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position:'relative'
  },
  sticker: {
    position:'absolute',
    right: 20,
    bottom: 23
  },
  attach: {
    marginLeft: 20,
    //rotate 15degree to the left
    transform: [{ rotate: '30deg'}]
  },
  mic: {
    marginRight: 20,
  },
  body:{
    flex:1,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor: '#f4f4f4',
    flexDirection:'column',
    //more chats should scroll and the height should be the remaing height after header and footer
    height: Dimensions.get('window').height - 180,
    //more chats should scroll
    overflowY: 'scroll'


    


  },
  senderchatholder: {
    flexDirection:'column',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginRight:20,
    marginBottom:10
  },
  senderchat: {
    backgroundColor: '#ffd2da',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    maxWidth: 250,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  chatText: {
    fontSize: 18,
    fontFamily: 'medium',
  },
  recieverchatholder: {
    flexDirection:'column',
    justifyContent:'flex-end',
    alignItems:'flex-start',
    marginLeft:20,
    marginBottom:10
  },
  recieverchat: {
    backgroundColor: '#ffdad2',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    maxWidth: 250,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
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



})

export default ChatScreen