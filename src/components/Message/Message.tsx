import { useContext } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import AppContext from '../../providers/AppContext';
import { MessageProps } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message }: MessageProps): JSX.Element => {
  const { appState } = useContext(AppContext);
  const currentUser = appState.userData;
  let msgBoxClass = '';

  if (message.author === currentUser?.username) {
    msgBoxClass = 'message-1';
  } else {
    msgBoxClass = 'message-2';
  }

  return (
    <div id='message' className={msgBoxClass}>
      <div className='message-header'>
        <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
        @{message.author}
      </div>

      <div className='message-content'>{message.content}</div>

      {/* <div className='message-meta'>
        {message.createdOn.toLocaleDateString('en-GB')}
      </div> */}
    </div>
  );
};

export default Message;
