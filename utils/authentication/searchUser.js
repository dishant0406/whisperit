
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { auth, firebaseHelper } from '../firebase/firebase';

//search all the users in firebase document where nameslug matches with the passed string
export const searchUser = async (searchString) => {
  const searchTerm = searchString.toLowerCase()
  const app = firebaseHelper(
  )
  const db = getFirestore(app);
  const usersRef = collection(db, 'users');
  const querys = query(usersRef, where('nameslug', '>=', searchTerm), where('nameslug', '<=', searchTerm + '\uf8ff'));
  const querySnapshot = await getDocs(querys);
  const users = []
  querySnapshot.forEach((doc) => {
    users.push(doc.data())
  }
  );

  //remove the logined user from the list
  const returnUsers = users.filter((user) => user.userid !== auth.currentUser.uid)
  return returnUsers

}
