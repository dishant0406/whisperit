import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font'
import AppNavigator from './navigation/AppNavigator';
import { useAuthStore } from './utils/zustand/zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { auth, firebaseHelper } from './utils/firebase/firebase';



SplashScreen.preventAutoHideAsync();
// AsyncStorage.clear()

export default function App() {
  const [appIsLoading, setAppIsLoaded] = useState(false)
  const [isLogined, setIsLogined] = useState(false)
  const { setUser } = useAuthStore()

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
      <AppNavigator />
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
