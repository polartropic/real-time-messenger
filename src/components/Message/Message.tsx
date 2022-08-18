import { useContext } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import AppContext from '../../providers/AppContext';
import { reactWithHeart, reactWithNo, reactWithYes } from '../../services/messages.services';
import { MessageProps } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message, currentChannel, handleEditMessage }: MessageProps): JSX.Element => {
  const { appState } = useContext(AppContext);
  const currentUser = appState.userData;

  const handleYes = () => {
    reactWithYes(currentChannel.id, message.id, (message.reactions.yes + 1));
  };

  const handleNo = () => {
    reactWithNo(currentChannel.id, message.id, (message.reactions.no + 1));
  };

  const handleHeart = () => {
    reactWithHeart(currentChannel.id, message.id, (message.reactions.heart + 1));
  };

  const handleEdit = () => {
    handleEditMessage(message);
  };

  if (message.author === currentUser?.username) {
    return (
      <div className='my-message'>
        <div className='edit-my-message'>
          <button className='edit-message-btn' onClick={handleEdit}>Edit</button>
        </div>

        <div className='my-message-date'>
          {message.createdOn.toLocaleDateString('en-GB')} at {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className='my-message-author'>
          @{message.author}
        </div>

        <div className='my-message-avatar'>
          <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
        </div>

        <div className='my-message-content'>
          {message.content}
        </div>

        <div className='my-react-btns'>
          <button className='my-reactions'>{`👍${message.reactions.yes}`}</button>
          <button className='my-reactions'>{`👎${message.reactions.no}`}</button>
          <button className='my-reactions'>{`❤️${message.reactions.heart}`}</button>
        </div>
      </div>
    );
  }

  return (
    <div className='others-message'>
      <div className='others-message-avatar'>
        <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
      </div>

      <div className='others-message-author'>
        @{message.author}
      </div>

      <div className='others-message-date'>
        {message.createdOn.toLocaleDateString('en-GB')} at {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className='others-message-content'>
        {message.content}
      </div>

      <div className='others-react-btns'>
        <button onClick={handleYes} className='others-reactions'>{`👍${message.reactions.yes}`}</button>
        <button onClick={handleNo} className='others-reactions'>{`👎${message.reactions.no}`}</button>
        <button onClick={handleHeart} className='others-reactions'>{`❤️${message.reactions.heart}`}</button>
      </div>
    </div>
  );
};

export default Message;
