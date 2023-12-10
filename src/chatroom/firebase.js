import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";



// react firebase Hook
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkkJo0ocStvwXAXprbmSIKco4-Oipbww4",
  authDomain: "se-2023-carpoolchatroom.firebaseapp.com",
  databaseURL: "https://se-2023-carpoolchatroom-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "se-2023-carpoolchatroom",
  storageBucket: "se-2023-carpoolchatroom.appspot.com",
  messagingSenderId: "375653425149",
  appId: "1:375653425149:web:b458a2b214bd13e9478394",
  measurementId: "G-H5CBS9S86X"
};


const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

