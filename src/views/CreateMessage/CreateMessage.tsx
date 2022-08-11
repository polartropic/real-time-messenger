import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { addMessage } from '../../services/messages.services';
import { ChannelProps, emojiObject } from '../../types/Interfaces';
import './CreateMessage.css';
import Picker from 'emoji-picker-react';

const CreateMessage = ({ currentChannel }: ChannelProps) => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState('');

  const onEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, emojiObject: emojiObject) => {
    setMessage((previousInput) => previousInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const sendMessage = (event: any) => {
    event.preventDefault();

    addMessage(currentChannel?.id, user?.username!, message)
      .then(() => setMessage(''))
      .catch(console.error);
  };

  return (
    <div className='message-box'>
      {showPicker && <Picker
        pickerStyle={{ width: '40%', position: 'absolute', margin: '-430px 0px 0px 0px' }}
        onEmojiClick={onEmojiClick} />}
      <button onClick={() => setShowPicker((val) => !val)} className='emoji-btn'><i className='fa-regular fa-face-smile'></i></button>
      <label htmlFor='content'></label>
      <textarea className='message-textarea' placeholder='Write a message here...' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
      <button type='submit' className='send-btn' value=''><i className='fa-solid fa-paper-plane' onClick={sendMessage}></i></button>
    </div>
  );
};

export default CreateMessage;
