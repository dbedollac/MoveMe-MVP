import * as firebase from 'firebase'
import "firebase/firestore"

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCICLsJYEeDK_Ji5VIQGyFp4UIcTJYhyw0",
  authDomain: "moveme-ad742.firebaseapp.com",
  databaseURL: "https://moveme-ad742.firebaseio.com",
  projectId: "moveme-ad742",
  storageBucket: "moveme-ad742.appspot.com",
  messagingSenderId: "50656092485",
  appId: "1:50656092485:web:aaffe261341d07cec65e2c",
  measurementId: "G-903QLQCN8H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()
