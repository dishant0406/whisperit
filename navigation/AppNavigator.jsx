import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import AuthScreen from '../screens/AuthScreen';
import { useAuthStore } from '../utils/zustand/zustand';
import { auth } from '../utils/firebase/firebase';




const AppNavigator = () => {
  const {user} = useAuthStore()


  return (
    <NavigationContainer>
        {(user.userid)?<MainNavigation/>:<AuthScreen/>}
      </NavigationContainer>
  )
}

export default AppNavigator