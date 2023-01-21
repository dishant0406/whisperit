import { Alert, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/logo.png'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ProgressLoader from 'rn-progress-loader';
import { inputValidation } from '../../utils/validation/inputValidation';
import { AuthReducer } from '../../utils/reducer/reducer';
import { signup } from '../../utils/authentication/signup';
import { useAuthStore } from '../../utils/zustand/zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';



const inititalValue = {
  name: {
    value: '',
    isValid: false,
    errorMessage:undefined
  },
  email: {
    value: '',
    isValid: false,
    errorMessage:undefined
  },
  password: {
    value: '',
    isValid: false,
    errorMessage:undefined
  },
  completeFormValid:{
    value: false,
  }
}

const SignupPage = (props) => {
  const [showPass, setShowPass] = useState(false)
  const [formState, dispatchFormState] = useReducer(AuthReducer, inititalValue)
  const {setUser} = useAuthStore()
  const [loading, setLoading] = useState(false)

  const inputChangeHandler = useCallback((type, text)=>{
    const validationText = inputValidation(type, text)
    dispatchFormState({type, value:text, isValid:validationText?false:true, errorMessage:validationText})
  },[dispatchFormState])

  const signupHandler = async ()=>{
    try{
      setLoading(true)
      const response = await signup(formState.email.value, formState.password.value, formState.name.value)
      setUser({
        userid: response.user.uid,
        token: response.user.stsTokenManager.accessToken,
        user: response.user,
      })
      await AsyncStorage.setItem('user', JSON.stringify({
        userid: response.user.uid,
        token: response.user.stsTokenManager.accessToken,
        user: response.user,
        expirationTime: new Date(response.user.stsTokenManager.expirationTime).toISOString(),
      }))

    }
    catch(err){
      setLoading(false)
      Alert.alert('Signup Error', err.message, [{text:'Okay'}])
    }
  }



  return (
    <ScrollView style={{flex:1}}>

    <ProgressLoader
                visible={loading}
                isModal={true} isHUD={true}
                hudColor={"#000000"}
                color={"#FFFFFF"} />
    <View style={styles.container}>
      <SafeAreaView style={{flex:1}}>
        <View style={styles.logocont}>
          <Image style={styles.logo} source={logo} resizeMode='contain'/>
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.logintext}>Please enter your e-mail address and create password</Text>
        </View>
        <View style={{alignItems:'center',justifyContent:'center',marginTop:10}}>
          <View style={{width:'100%', flex:1, alignItems:'center'}}>
            <View style={{...styles.inputcont, marginTop:15}}>
              <View style={styles.inputicon}>
                <FontAwesome5 name="user" size={24} color="#919191" />
              </View>
              <TextInput value={formState.name.value} autoCapitalize='none' onChangeText={(text)=>inputChangeHandler('name', text)} style={styles.input} placeholder={'Full Name'}/>
            </View>
            <Text style={styles.errortext}>{formState.name.errorMessage}</Text>
          </View>
          <View style={{width:'100%', flex:1, alignItems:'center'}}>
            <View style={{...styles.inputcont, marginTop:20}}>
              <View style={styles.inputicon}>
                <Ionicons name="mail-outline" size={28} color="#919191" />
              </View>
              <TextInput value={formState.email.value} keyboardType='email-address' autoCapitalize='none' onChangeText={(text)=>inputChangeHandler('email', text)} style={styles.input} placeholder={'Enter your email'}/>
            </View>
            <Text style={styles.errortext}>{formState.email.errorMessage}</Text>
          </View>
          <View style={{width:'100%', flex:1, alignItems:'center'}}>
            <View style={{...styles.inputcont, marginTop:20,}}>
              <View style={styles.inputicon}>
                <Ionicons name="ios-lock-closed-outline" size={28} color="#919191" />
              </View>
              <TextInput value={formState.password.value} keyboardAppearance='dark' autoCapitalize='none' secureTextEntry={!showPass} onChangeText={(text)=>inputChangeHandler('password', text)} style={{...styles.input, paddingRight:40}} placeholder={'Enter your password'}/>
                <TouchableOpacity onPress={()=>setShowPass(!showPass)} style={styles.showhidepass}>
                  <Ionicons name={showPass?"ios-eye-off-outline":'ios-eye-outline'} size={28} color="#919191" />
                </TouchableOpacity>
            </View>
            <Text style={styles.errortext}>{formState.password.errorMessage}</Text>
          </View>
            <TouchableOpacity onPress={signupHandler} disabled={!formState.completeFormValid.value}>
              <View style={formState.completeFormValid.value?styles.signupbutton:styles.disabledsignupbuttom}>
                <Text style={styles.buttontext}>Sign Up</Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.alreadytext}>Already have an account? <Text onPress={()=>props.navigation.navigate('login')} style={styles.alreadytextlink}>Login</Text></Text>
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
    minHeight:Dimensions.get('window').height+90,
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
    width:'100%',
    position:'relative',
    flex:1,
    alignItems:'center',
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
    left:15,
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
  disabledsignupbuttom: {
    width:220,
    flex:0,
    alignItems:'center',
    justifyContent:'center',
    height:65,
    borderRadius:40,
    backgroundColor:'#c5c5c5',
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
  },
  showhidepass: {
    position:'absolute',
    right:15,
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
  errortext: {
    color:'red',
    fontSize:12,
    fontFamily:'medium',
    marginLeft:20,
    width:'90%',
    textAlign:'left',
  },





})