import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { firebaseHelper } from '../firebase/firebase';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export const pickImage = async () => {
  //check if permission is there if no then request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
  }

  //launch image picker
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });



  if (!result.canceled) {
    return result.assets;
  }
}

export const uploadImage = async (image) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', image, true);
    xhr.send(null);
  })

  const app = firebaseHelper();
  const storage = getStorage(app);
  const reff = ref(storage, 'images/' + uuid.v4());
  const snapshot = await uploadBytesResumable(reff, blob);
  return await getDownloadURL(reff)


}



