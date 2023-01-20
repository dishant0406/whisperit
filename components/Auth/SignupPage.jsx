import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/logo.png'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const SignupPage = (props) => {
  return (
    <ScrollView>

    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.logocont}>
          <Image style={styles.logo} source={logo} resizeMode='contain'/>
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.logintext}>Please enter your e-mail address and create password</Text>
        </View>
        <View style={{alignItems:'center',justifyContent:'center',marginTop:10}}>
          <View style={{...styles.inputcont, marginTop:15}}>
            <View style={styles.inputicon}>
              <FontAwesome5 name="user" size={24} color="#919191" />
            </View>
            <TextInput style={styles.input} placeholder={'Full Name'}/>
          </View>
          <View style={{...styles.inputcont, marginTop:30}}>
            <View style={styles.inputicon}>
              <Ionicons name="mail-outline" size={28} color="#919191" />
            </View>
            <TextInput style={styles.input} placeholder={'Enter your email'}/>
          </View>
          <View style={{...styles.inputcont, marginTop:30}}>
            <View style={styles.inputicon}>
              <Ionicons name="ios-lock-closed-outline" size={28} color="#919191" />
            </View>
            <TextInput style={styles.input} placeholder={'Enter your password'}/>
          </View>
            <TouchableOpacity>
              <View style={styles.signupbutton}>
                <Text style={styles.buttontext}>Sign Up</Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.alreadytext}>Already have an account? <Text onPress={props.onPress} style={styles.alreadytextlink}>Login</Text></Text>
            </View>
        </View>
      </SafeAreaView>
    </View>
    
    </ScrollView>
  )
}

export default SignupPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
  },
  logocont: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    height:70,
  },
  logo: {
    width: 300,
  },
  textcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height:70,
  },
  logintext: {
    fontSize: 17,
    width:300,
    marginTop:15,
    textAlign:'center',
    color:'#c5c5c5',
    fontFamily:'medium'
  },
  inputcont: {
    width:'90%',
    position:'relative'


  },
  input: {
    width:'95%',
    height:55,
    paddingTop:5,
    borderRadius:30,
    backgroundColor:'#fafcfe',
    fontSize:17,
    fontFamily:'medium',
    paddingLeft:65,
  },
  inputicon: {
    position:'absolute',
    left:10,
    zIndex:100,
    backgroundColor:'#fff',
    width:40,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    height:40,
    borderRadius:20,
    top:7,
  },
  signupbutton: {
    width:220,
    flex:0,
    alignItems:'center',
    justifyContent:'center',
    height:65,
    borderRadius:40,
    backgroundColor:'#111111',
    fontSize:17,
    fontFamily:'medium',
    marginTop:50,
  },
  buttontext: {
    color:'#fff',
    fontSize:17,
    fontFamily:'medium',
  },
  alreadytext: {
    color:'#919191',
    fontSize:16,
    fontFamily:'medium',
    marginTop:20,
    textAlign:'center'
  },
  alreadytextlink: {
    color:'#111111',
    fontSize:16,
    fontFamily:'medium',
    marginTop:20,
    textAlign:'center'
  }



})