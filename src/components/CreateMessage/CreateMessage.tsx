import React, { useEffect, useState } from 'react';
import { CreateMessageProps, emojiObject } from '../../types/Interfaces';
import Picker from 'emoji-picker-react';
import './CreateMessage.css';

const CreateMessage = ({ handleSubmit, existingMessage }: CreateMessageProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (existingMessage) setMessage(existingMessage);
  }, [existingMessage]);

  const sendMessage = () => {
    console.log(message);

    handleSubmit(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };


  const onEmojiClick = (_: React.MouseEvent<Element, MouseEvent>, emojiObject: emojiObject) => {
    setMessage((previousInput) => previousInput + emojiObject.emoji);
    setShowPicker(false);
  };


  return (
    <div className='message-box'>
      {showPicker && <Picker
        pickerStyle={{ width: '40%', position: 'absolute', margin: '-430px 0px 0px 0px' }}
        onEmojiClick={onEmojiClick} />}
      <button onClick={() => setShowPicker((val) => !val)} className='emoji-btn'><i className='fa-regular fa-face-smile'></i></button>
      <label htmlFor='content'></label>
      <textarea className='message-textarea' placeholder='Write a message here...' value={message} onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)}></textarea>
      <button className='send-btn' value=''><i className='fa-solid fa-paper-plane' onClick={sendMessage}></i></button>
    </div>
  );
};

export default CreateMessage;
