import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { MessageProps } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message }: MessageProps): JSX.Element => {
  return (
    <div id='message' className='message'>
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
