import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import avatar from '../../assets/avatar.png'
import { FontAwesome5, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { auth } from '../../utils/firebase/firebase';
import { useAuthStore, useUserDetailsStore } from '../../utils/zustand/zustand';
import ProgressLoader from 'rn-progress-loader';
import { getAuth, createUserWithEmailAndPassword, updateEmail } from "firebase/auth";
import { getDoc, getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import { pickImage, uploadImage } from '../../utils/ImagePicker/ImagePickerHelper';
import { removePushToken } from '../../utils/authentication/signup';


const InputField = ({defaultValue, icon, type})=>{
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const {userDetails, setUserDetails} = useUserDetailsStore()
  
  const inputref = useRef()
  const handleClick = async ()=>{
    if(isEditing){
      if(type==='email'){
        //update email in firestore
        try{
        await updateEmail(auth.currentUser, value)
        const db = getFirestore();
        const userRef = doc(db, "users", auth.currentUser.uid);
         await setDoc(userRef, {
          email: value,
        }, { merge: true });
        //update email in authentication of firebase
        setUserDetails({...userDetails, email:value})
        }
        catch(err){
          setValue(userDetails[type])
          let error = 'Something went wrong'
          if(err.code==='auth/email-already-in-use'){
            error = 'Email already in use'
          }
          if(err.code==='auth/invalid-email'){
            error = 'Invalid email'
          }
          if(err.code==='auth/requires-recent-login'){
            error = 'Please login again'
          }
          Alert.alert('Update Error', error)
        }
      }
      if(type==='fullname'){
        //update name in firestore
        const db = getFirestore();
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          fullname: value,
          nameslug:value.toLowerCase()
        }, { merge: true });
        setUserDetails({...userDetails, fullname:value})
      }
      if(type==='aboutme'){
        //update phone in firestore
        const db = getFirestore();
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          aboutme: value,
        }, { merge: true });
        setUserDetails({...userDetails, aboutme:value})
      }
    }
    setIsEditing(!isEditing)
  }
  return (
    <View style={styles.inputcont}>
      <View style={{marginLeft:5}}>
        {icon}
      </View>
      <View style={{marginLeft:15, marginTop:5}}>
         {isEditing && <TextInput onChangeText={text=>setValue(text)} value={value} autoFocus={true} ref={inputref}  numberOfLines={1} defaultValue={defaultValue} style={{fontSize:20, fontFamily:'medium',flex:1, color:'#5b647e', width:230, textAlign:'left', backgroundColor:'#fff'}}/>}
        {!isEditing && <Text numberOfLines={1} style={{fontSize:20, fontFamily:'medium',flex:1, color:'#5b647e', width:230, textAlign:'left', backgroundColor:'#fff', marginTop:5}}>{value}</Text>}
      </View>
      <TouchableOpacity style={{marginLeft:30}} onPress={handleClick}>
        {!isEditing && <MaterialCommunityIcons name="square-edit-outline" size={24} color="#5b647e" />}
        {isEditing && <Feather name="check-square" size={24} color="#efb73d" />}
      </TouchableOpacity>
  </View>
  )
}



const Logout = ()=>{
  const {setUser} = useAuthStore()
  const {userDetails, setUserDetails} = useUserDetailsStore()
  const handleLogout = async ()=>{
    await auth.signOut()
    await removePushToken(userDetails)
    setUser({
      userid: null,
      token: null,
      user: null,
    })
  }
  return (
    <TouchableOpacity onPress={handleLogout} style={styles.inputcont}>
      <View style={{marginLeft:5}}>
        <MaterialIcons name="logout" size={24} color="#5b647e" />
      </View>
      <View style={{marginLeft:15, marginTop:5}}>
        <Text numberOfLines={1} style={{fontSize:20, fontFamily:'medium',flex:1, color:'#5b647e', width:230, textAlign:'left', backgroundColor:'#fff', marginTop:5}}>Logout</Text>
      </View>
  </TouchableOpacity>
  )
}

const SettingPage = () => {
  const {user} = useAuthStore()
  const [userObject, setUserObject] = useState({})
  const [loading, setLoading] = useState(false)
  const {userDetails,setUserDetails} = useUserDetailsStore()

  const handleImagePick = async ()=>{
    try{
      
      const res = await pickImage()
      setLoading(true)
      if(res){
        const url = await uploadImage(res[0].uri)
        if(!url){
          Alert.alert('Error', 'Could not upload Image')
        }
        else{
          const db = getFirestore();
          const userRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userRef, {
            photo: url,
          }, { merge: true });
          setUserDetails({...userDetails, photo:url})
        }
      }
    }catch(err){
      Alert.alert('Error', 'Could not upload Image')
    }
    setLoading(false)
  }
  return (
    <ScrollView>
      {loading && <ProgressLoader
                visible={loading}
                color={"#FFFFFF"} />}
    <View style={styles.container}>
      <View style={{width:'100%', alignItems:'center', position:'relative'}}>
        <View style={styles.profileCont}>
          <Image source={userDetails.photo?{uri:userDetails.photo}:avatar} style={styles.profileImg}/>
        </View>
          <TouchableOpacity onPress={handleImagePick} style={styles.profileEdit}>
            <Octicons name="pencil" size={18} color="black" />
          </TouchableOpacity>
        <Text style={styles.profilename}>{userDetails.fullname||'Full Name'}</Text>
      </View>
      <View style={{width:'100%', alignItems:'center',}}>

        <InputField type='fullname' icon={<FontAwesome5 name="user" size={24} color="#5b647e" />} defaultValue={userDetails.fullname||'Full Name'}/>
        <InputField type='email' icon={<Ionicons name="mail-open" size={28} color="#5b647e" />} defaultValue={userDetails.email||'example@example.com'}/>
        <InputField type='aboutme' icon={<Ionicons name="ios-information-circle-outline" size={28} color="#5b647e" />} defaultValue={userDetails.aboutme||'About me!'}/>
        <Logout/>
        
      </View>
    </View>
    </ScrollView>
  )
}

export default SettingPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f4f4f4',
  },
  profileCont: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    height:150,
    width:150,
    borderRadius:100,
    backgroundColor: '#00d4ff',

    resizeMode:'cover',

    overflow:'hidden'
  },
  profileImg: {
    width: 150,
    height:150,
    borderRadius:35,

  },
  profilename: {
    fontSize: 24,
    width:300,
    marginTop:10,
    textAlign:'center',
    color:'#101010',
    fontFamily:'semi-bold'
  },
  profileEdit: {
    position:'absolute',
    right:'30%',
    bottom:'30%',
    height:30,
    width:30,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:100,
    borderColor:'#efb73d',
    borderWidth:2,
    padding:5,
    margin:5,
    zIndex:100,
  },
  inputcont: {
    width:'90%',
    position:'relative',
    alignItems:'center',
    flexDirection:'row',
    marginTop:15,
    backgroundColor:'#fff',
    borderRadius:10,
    padding:10,
    marginBottom:10,
    //dropshadow everywhere
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
    
    
    height:70

  }


})