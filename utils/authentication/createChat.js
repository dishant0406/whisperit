import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseHelper } from "../firebase/firebase";
import uuid from 'react-native-uuid';


export const createChat = async (logineduserid, chatusers) => {

  try {

    const newChatData = {
      users: chatusers,
      createdBy: logineduserid,
      createdAt: new Date().toISOString(),
      updatedBy: logineduserid,
      updatedAt: new Date().toISOString(),
    }
    const app = firebaseHelper()
    //save the userid fullname email photo to collection users with id as userid
    const db = getFirestore(app);
    const usersRef = collection(db, "chats");
    const docRef = await addDoc(usersRef, newChatData);
    console.log("Document written with ID: ", docRef.id);
    for (let i = 0; i < chatusers.length; i++) {
      const user = chatusers[i]
      const userRef = doc(db, "usersChats", user);
      await setDoc(userRef, {
        [uuid.v4()]: docRef.id
      }, { merge: true });
    }

    return docRef.id

  }
  catch (err) {
    console.log(err)
  }

}

export const sendTextMessage = async (chatid, logineduserid, messageText, replyingTo) => {
  try {
    const app = firebaseHelper()
    const db = getFirestore(app);
    const chatsRef = doc(db, "messages", chatid);
    let id = uuid.v4()
    let messageObject = {
      [id]: {
        message: messageText,
        type: 'text',
        createdAt: new Date().toISOString(),
        createdBy: logineduserid,
      }
    }
    if (replyingTo) {
      messageObject[id].replyingTo = replyingTo
    }
    await setDoc(chatsRef, messageObject
      , { merge: true });

    //update the chats collection information
    const chatsRef2 = doc(db, "chats", chatid);
    await setDoc(chatsRef2, {
      updatedAt: new Date().toISOString(),
      updatedBy: logineduserid,
      latestMessage: messageText
    }, { merge: true });
  }
  catch (err) {
    console.log(err)
  }


}

export const starMessage = async (messaageId, chatId, userId) => {
  try {
    const app = firebaseHelper()
    const db = getFirestore(app);
    const chatsRef = doc(db, "userStarredMessages", userId);

    const snapshot = await getDoc(chatsRef)
    if (snapshot.data()?.[chatId]?.[messaageId]) {
      //delete from firestore
      const starredMessageData = {
        [chatId]: {
          [messaageId]: null
        }
      }
      await setDoc(chatsRef, starredMessageData, { merge: true });

    }
    else {
      //add
      const starredMessageData = {
        [chatId]: {
          [messaageId]: {
            messaageId,
            chatId,
            starredAt: new Date().toISOString()
          }
        }
      }
      await setDoc(chatsRef, starredMessageData, { merge: true });
    }
  } catch (err) {
    console.log(err)
  }
}