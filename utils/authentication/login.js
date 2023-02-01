import { auth, firebaseHelper } from "../firebase/firebase"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getUser } from './signup';


export const login = async (email, password, name) => {
  // firebase signup with email and password
  try {
    const app = firebaseHelper()
    const userCredential = await signInWithEmailAndPassword(auth, email, password
    );

    const userData = await getUser(userCredential.user.uid)
    await storePushToken(userData)

    return userCredential;
  } catch (err) {
    console.log(err)
    let errMessage = 'Something went wrong'

    if (err.code === 'auth/invalid-email') {
      errMessage = 'Invalid email'
    }
    if (err.code === 'auth/user-not-found') {
      errMessage = 'User not found'
    }
    if (err.code === 'auth/wrong-password') {
      errMessage = 'Wrong password'
    }

    throw new Error(errMessage)


  }
};

const storePushToken = async (userData) => {
  if (!Device.isDevice) {
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  const tokenData = { ...userData.pushTokens } || {};
  const tokenArray = Object.values(tokenData);

  if (tokenArray.includes(token)) {
    return;
  }

  tokenArray.push(token);

  for (let i = 0; i < tokenArray.length; i++) {
    const tok = tokenArray[i];
    tokenData[i] = tok;
  }

  const app = firebaseHelper()
  const db = getFirestore(app);
  const usersRef = collection(db, "users");
  //update user push tokens
  const data = await updateDoc(doc(usersRef, userData.userid), {
    pushTokens: tokenData
  });

  return token;
}
