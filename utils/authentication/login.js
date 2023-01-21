import { auth, firebaseHelper } from "../firebase/firebase"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";


export const login = async (email, password, name) => {
  // firebase signup with email and password
  try {
    const app = firebaseHelper()
    const userCredential = await signInWithEmailAndPassword(auth, email, password
    );

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
