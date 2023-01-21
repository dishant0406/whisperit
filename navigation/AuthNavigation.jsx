import React from 'react'
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import LoginPage from '../components/Auth/LoginPage';
import SignupPage from '../components/Auth/SignupPage';


const AuthNavigation = () => {

  return (
    
        <Stack.Navigator>
          <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="signup" component={SignupPage} options={{
            headerShown: false,

          }}/>
        </Stack.Navigator>
      
  )
}

export default AuthNavigation