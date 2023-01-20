import { View, Text, StyleSheet, Image, TextInput, Dimensions, ScrollView, ScrollViewBase, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import avatar from '../assets/avatar.png'

const ChatScreen = () => {
  const [messageText, setMessageText] = useState('')
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={90}>
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.titleheader}>
          <View style={styles.icon}>
              <Image source={avatar} style={styles.avatar}/>
            </View>
            <View style={styles.headertitle}>
              <Text style={styles.headername}>Henna Beck</Text>
              <Text style={styles.status}>Online</Text>
            </View>
          </View>
          <TouchableOpacity  onPress={()=>console.log('search')} style={styles.headericons}>
            <Feather name="search" size={24} color="#5f6368" />
          </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView scrollEnabled={true} style={styles.body}>
        <View style={styles.senderchatholder}>
          <View style={styles.senderchat}>
            <Text style={styles.chatText}>Hi Henna How are you</Text>
          </View>
        </View>
        <View style={styles.recieverchatholder}>
          <View style={styles.recieverchat}>
            <Text style={styles.chatText}> Lorem ipsum dolor sit amet consectetur adipisicing elit. At debitis esse porro a commodi provident, consequatur expedita, voluptatem nihil cum aspernatur recusandae qui eaque? Commodi, explicabo! Praesentium excepturi eaque tempora.</Text>
          </View>
        </View>
        <View style={styles.senderchatholder}>
          <View style={styles.senderchat}>
            <Text style={styles.chatText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod in reprehenderit odio ad eveniet. Culpa amet facilis, hic ab eveniet laborum quasi praesentium placeat. Quidem eius aperiam cupiditate commodi similique?</Text>
          </View>
        </View>
        <View style={styles.recieverchatholder}>
          <View style={styles.recieverchat}>
            <Text style={styles.chatText}> Lorem ipsum dolor sit amet consectetur adipisicing elit. At debitis esse porro a commodi provident, consequatur expedita, voluptatem nihil cum aspernatur recusandae qui eaque? Commodi, explicabo! Praesentium excepturi eaque tempora.</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
        
        

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
        <TouchableOpacity onPress={()=>console.log('mic')} style={styles.mic}>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    alignItems:'center'
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
    backgroundColor: '#f1f3f4',
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
    backgroundColor: '#fafafa',
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
    flexDirection:'row',
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
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },



})

export default ChatScreen