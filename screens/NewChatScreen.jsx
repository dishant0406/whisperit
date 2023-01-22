import { Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import up from '../assets/thumbup.png'
import down from '../assets/thumbdown.png'
import { searchUser } from '../utils/authentication/searchUser';


const CustomHeaderButton = props =>{
  return (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={22} color={props.color??'#464c52'} />
  )
}

const NotAvailable = ({title, image, desc})=>{
  return <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <View style={styles.notfound}>
              <Text style={{fontSize:24, fontFamily:'semi-bold', color:'#101010'}}>{title}</Text>
              <Text style={{fontSize:20, fontFamily:'semi-bold', color:'#9a9691', textAlign:'center', width:'80%'}}>{desc}</Text>
              <Image source={image} style={{width:100, height:100}}/>
            </View>
        </View>
}

const NewChatScreen = (props) => {
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item style={{padding:5, backgroundColor:'#fff', paddingHorizontal:0, borderRadius:10}} title='Close' iconName='ios-close' onPress={() => props.navigation.goBack()}/>
        </HeaderButtons>

      ),
      headerTitle:'New Chat',
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
      headerShadowVisible: false,

    });
    },[])

    useEffect(()=>{
      const searchTimeout = setTimeout(async ()=>{
        if(searchValue!==''){
          const data = await searchUser(searchValue)
          setSearchResult(data)
          console.log(data)
        }else{
          setSearchResult([])
        }
      },500)


      return () => {
        clearTimeout(searchTimeout)
      }
    },[searchValue])

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{width:'90%', position:'relative'}}>
          <View style={styles.icon}>
            <Feather name="search" size={28} color="#9a9691" />
          </View>
          <TextInput value={searchValue} onChangeText={text=>setSearchValue(text)} style={styles.input} placeholder={'Search for users'}/>
        </View>
        <View style={{flex:1,width:'100%', 
        height:Dimensions.get('window').height-200
        }}>
          {searchValue===''&&<NotAvailable desc={'Type somthing to search the user according to the string'} title={'Search for users'} image={up} />}
          {searchValue!==''&& searchResult.length<1 &&<NotAvailable desc={'No user found with the given string, try searching for some other user'} title={'No user found'} image={down} />}
        </View>
      </View>
    </ScrollView>
  )
}

export default NewChatScreen

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
    height:'60%',
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

  }
})