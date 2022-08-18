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
      <div id='message' className='message-1'>
        <div className='edit-message'>
          <button className='edit-message-btn' onClick={handleEdit}>Edit</button>
        </div>

        <div className='message-date-1'>
          {message.createdOn.toLocaleDateString('en-GB')} at {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className='message-author-1'>
          @{message.author}
        </div>

        <div className='message-avatar-1'>
          <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
        </div>

        <div className='message-content-1'>
          {message.content}
        </div>

        <div className='react-btns-1'>
          <button className='reactions-1'>{`👍${message.reactions.yes}`}</button>
          <button className='reactions-1'>{`👎${message.reactions.no}`}</button>
          <button className='reactions-1'>{`❤️${message.reactions.heart}`}</button>
        </div>
      </div>
    );
  }

  return (
    <div id='message' className='message-2'>
      <div className='message-avatar-2'>
        <img src={DefaultAvatar} alt='avatar' className='default-avatar' />
      </div>

      <div className='message-author-2'>
        @{message.author}
      </div>

      <div className='message-date-2'>
        {message.createdOn.toLocaleDateString('en-GB')} at {message.createdOn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className='message-content-2'>
        {message.content}
      </div>

      <div className='react-btns-2'>
        <button onClick={handleYes} className='reactions-2'>{`👍${message.reactions.yes}`}</button>
        <button onClick={handleNo} className='reactions-2'>{`👎${message.reactions.no}`}</button>
        <button onClick={handleHeart} className='reactions-2'>{`❤️${message.reactions.heart}`}</button>
      </div>
    </div>
  );
};

export default Message;
