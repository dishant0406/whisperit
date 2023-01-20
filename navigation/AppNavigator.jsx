import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import AuthScreen from '../screens/AuthScreen';




const AppNavigator = () => {
  const [isAuth, setisAuth] = useState(false)


  return (
    <NavigationContainer>
        {isAuth?<MainNavigation/>:<AuthScreen/>}
      </NavigationContainer>
  )
}

export default AppNavigator