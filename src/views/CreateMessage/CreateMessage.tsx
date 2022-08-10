import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { addMessage } from '../../services/messages.services';
import { ChannelProps } from '../../types/Interfaces';
import './CreateMessage.css';

const CreateMessage = ({ currentChannel }: ChannelProps) => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  const [message, setMessage] = useState({
    author: user?.username,
    content: '',
  });

  const updateMessage = (prop: any) => (event: any) => {
    setMessage({
      ...message,
      [prop]: event.target.value,
    });
  };

  const sendMessage = async (event: any) => {
    event.preventDefault();

    try {
      await addMessage(currentChannel?.id, user?.username!, message.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className='message-box' onSubmit={sendMessage}>
      <button className='emoji-btn'><i className='fa-regular fa-face-smile'></i></button>
      <label htmlFor='content'></label>
      <textarea className='message-textarea' placeholder='Write a message here...' name='content' onChange={updateMessage('content')}></textarea>
      <button type='submit' className='send-btn' value=''><i className='fa-solid fa-paper-plane'></i></button>
    </form>
  );
};

export default CreateMessage;
