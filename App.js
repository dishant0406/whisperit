import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font'
import AppNavigator from './navigation/AppNavigator';
import { useAuthStore, useUserDetailsStore } from './utils/zustand/zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { auth, firebaseHelper } from './utils/firebase/firebase';
import { getUser } from './utils/authentication/signup';
import { decode } from 'base-64';
import { MenuProvider } from 'react-native-popup-menu';


SplashScreen.preventAutoHideAsync();
// AsyncStorage.clear()



if (typeof atob === 'undefined') {
  global.atob = decode;
}

export default function App() {
  const [appIsLoading, setAppIsLoaded] = useState(false)
  const [isLogined, setIsLogined] = useState(false)
  const { setUser } = useAuthStore()
  const { setUserDetails } = useUserDetailsStore()

  useEffect(() => {
    (
      async () => {
        auth.onAuthStateChanged(async item => {
          try {
            await Font.loadAsync({
              'regular': require('./assets/fonts/Poppins-Regular.ttf'),
              'medium': require('./assets/fonts/Poppins-Medium.ttf'),
              'bold': require('./assets/fonts/Poppins-Bold.ttf'),
              'light': require('./assets/fonts/Poppins-Light.ttf'),
              'black': require('./assets/fonts/Poppins-Black.ttf'),
              'thin': require('./assets/fonts/Poppins-Thin.ttf'),
              'semi-bold': require('./assets/fonts/Poppins-SemiBold.ttf'),
              'extra-bold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
              'extra-light': require('./assets/fonts/Poppins-ExtraLight.ttf'),

            })

          }
          catch (e) {
            console.log(e)
          }
          finally {
            setAppIsLoaded(true)
          }
        })
      }
    )()
  }, [])

  //auth.onStateChange setLogined true




  useEffect(() => {
    (
      async () => {
        try {
          auth.onAuthStateChanged(async (userItem) => {
            if (userItem) {
              const user = await AsyncStorage.getItem('user')
              if (user) {
                const parseUser = JSON.parse(user)
                if ((new Date(parseUser.expirationTime).getTime() < new Date().getTime()) || !parseUser.userid || !parseUser.token) {
                  console.log('token expired')
                  return
                }
                //else set user to zustand
                console.log('token not expired')
                setUser({
                  userid: parseUser.user.uid,
                  token: parseUser.token,
                  user: parseUser.user
                })
                const userDetails = await getUser(userItem.uid)
                if (userDetails) {
                  setUserDetails(
                    {
                      fullname: userDetails.fullname,
                      email: userDetails.email,
                      photo: userDetails.photo,
                      userid: userDetails.userid,
                      aboutme: userDetails.aboutme
                    }

                  )
                }
              }

            }
          })
        }
        catch (e) {
          console.log(e)
        }
      }
    )()
  }, [auth.currentUser])


  const onLayout = useCallback(
    async () => {
      await SplashScreen.hideAsync();
    }
    , [])

  if (!appIsLoading) {
    return null
  }


  return (
    <SafeAreaProvider
      onLayout={onLayout}
    >
      <MenuProvider>
        <AppNavigator />
      </MenuProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  simpleButton: {

    fontFamily: 'regular',
    fontSize: 20,

  },

});
