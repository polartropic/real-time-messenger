import { useContext } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import AppContext from '../../providers/AppContext';
import { MessageProps } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message }: MessageProps): JSX.Element => {
  const { appState } = useContext(AppContext);
  const currentUser = appState.userData;

  if (message.author === currentUser?.username) {
    return (
      <div id='message' className='message-1'>
        <div className='message-content-1'>
          <p className='message-author-1'>@{message.author}</p>
          <p>{message.content}</p>
        </div>

        <div className='message-header-1'>
          <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
          <br />
          {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <br />
          {message.createdOn.toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div id='message' className='message-2'>
      <div className='message-header-2'>
        <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
        <br />
        {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <br />
        {message.createdOn.toLocaleDateString()}
      </div>

      <div className='message-content-2'>
        <p className='message-author-2'>@{message.author}</p>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
