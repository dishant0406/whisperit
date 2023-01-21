// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDQTJIL7uMDQLbJqIoOjf6i4hzArEhsHLY",
  authDomain: "whisherit.firebaseapp.com",
  projectId: "whisherit",
  storageBucket: "whisherit.appspot.com",
  messagingSenderId: "1069809349673",
  appId: "1:1069809349673:web:ef0d226eb000409e449838",
  measurementId: "G-BY6LSPLQPB"
};

export const firebaseHelper = () => {
  return initializeApp(firebaseConfig);
}

export const auth = initializeAuth(initializeApp(firebaseConfig), {
  persistence: getReactNativePersistence(AsyncStorage)
});