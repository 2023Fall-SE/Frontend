import React, { useState } from 'react';
import {auth, db} from '../firebase'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {Form , Badge, Button} from 'react-bootstrap';
import {useAuth} from "../../auth/AuthContext";


const style = {
  form: `h-14 w-full max-w-[728px]  flex text-xl absolute bottom-0`,
  input: `w-full text-xl p-3 bg-gray-900 text-black outline-none border-none`,
  button: `w-[20%] bg-green-500`,
};

const SendMessage = ({scroll}) => {
  const [input, setInput] = useState('');
  const { isLoaded, userToken} = useAuth(); /* Get Token page data*/
  const sendMessage = async (e) => {
    e.preventDefault()
    if (input === '') {
        alert('Please enter a valid message')
        return
    }
    


    const {uid, displayName } = auth.currentUser
    
    await addDoc(collection(db, 'messages'), {
        text: input,
        name: userToken.user_display_name,
        uid,
        timestamp: serverTimestamp()
    })
    setInput('')
    scroll.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <form onSubmit={sendMessage} className={style.form}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type='text'
        placeholder='Message'
      />
      <button className={style.button} type='submit'>
        發送訊息
      </button>
    </form>
  );
};

export default SendMessage;
