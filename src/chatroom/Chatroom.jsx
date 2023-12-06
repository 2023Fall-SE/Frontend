import React, { useRef, useState,useEffect } from 'react';
import './Chatroom.css';



// Firebase Modular 




// react firebase Hook
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {collection, orderBy, limit, query,addDoc, serverTimestamp} from 'firebase/firestore'
import { db, auth} from './firebase'
import { GoogleAuthProvider, signInAnonymously ,signInWithPopup, signOut } from 'firebase/auth';




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




function Chatroom() {

  const [user] = useAuthState(auth);

  const messageRef = collection(db,"message");
  const queryRef = query(messageRef, orderBy ("createdAt","desc"), limit(20))
  const [messages] = useCollection(queryRef,{idField: "id"})

  const [FormValue, setFormValue] = useState('');
   
  const sendMessage = async(e) =>{
    e.preventDefault()

    if(!user || formValue) return

    const payload = {text: formValue, createAt: serverTimestamp(),uid: user.uid,photoURL: user.photoURL}
    await addDoc(messageRef, payload)

    setFormValue('')
  }

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth,provider);
  }

  const logOut = () => {
    signOut(auth)
  }


  function ChatMessage(props){
    if(!auth.currentUser) return
    const {text,uid , photoURL} = props.message
    const className = uid === auth.currentUser.uid ? "sent" : "recieved"
    return(
        <div className= {className}>
            <p>{text}</p>
            <img src = {photoURL} alt="User Photo"/>
        </div>
    )
  }



  return(
    <div className='Chatroom'>
      <h1>Messages</h1>

      <div className='messages'>
        {messages && messages.docs.map(msg => <ChatMessage key={msg.id} message={msg.data()}/>)}
      </div>

      <form >
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
        <button onClick={(e) => sendMessage(e)}> Send</button>
      </form>

      <div className='buttons'>
        {!user ? <button className='login' onClick={()=> googleSignIn()}>Login with google</button>:
        <button className='logout' onClick={() => logOut()}>Log out</button>}
      </div>
    </div>

  );

}


export default Chatroom;