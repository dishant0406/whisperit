import { auth, firebaseHelper } from "../firebase/firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";




export const signup = async (email, password, name) => {
  // firebase signup with email and password
  try {
    const app = firebaseHelper()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password
    );
    //save the userid fullname email photo to collection users with id as userid
    const db = getFirestore(app);
    const usersRef = collection(db, "users");

    const data = await setDoc(doc(usersRef, userCredential.user.uid), {
      fullname: name,
      email: email,
      photo: userCredential.user.photoURL,
      userid: userCredential.user.uid
    });



    return userCredential;
  } catch (err) {
    console.log(err)
    let errMessage = 'Something went wrong'
    if (err.code === 'auth/email-already-in-use') {
      errMessage = 'Email already in use'
    }
    if (err.code === 'auth/invalid-email') {
      errMessage = 'Invalid email'
    }
    if (err.code === 'auth/weak-password') {
      errMessage = 'Weak password'
    }
    throw new Error(errMessage)

  }
};