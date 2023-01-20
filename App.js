import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font'
import AppNavigator from './navigation/AppNavigator';


SplashScreen.preventAutoHideAsync();


export default function App() {
  const [appIsLoading, setAppIsLoaded] = useState(false)

  useEffect(() => {
    (
      async () => {
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
      }
    )()
  }, [])

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
