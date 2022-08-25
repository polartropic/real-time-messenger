import { useContext, useEffect, useState } from 'react';
import InitialsAvatar from 'react-initials-avatar';
import { Reaction } from '../../common/reactions.enum';
import AppContext from '../../providers/AppContext';
import { reactWithHeart, reactWithNo, reactWithYes } from '../../services/messages.services';
import { getUserByUsername } from '../../services/users.services';
import { MessageProps, User } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message, currentChannel, handleEditMessage }: MessageProps): JSX.Element => {
  const { appState } = useContext(AppContext);
  const currentUser = appState.userData;

  const [author, setAuthor] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    imgURL: '',
    status: '',
    teams: [],
    channels: [],
    uid: '',
  });

  useEffect(() => {
    getUserByUsername(message.author)
      .then((res) => setAuthor(res.val()));
  }, [message.author]);

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

  const isCurrentUserAuthor = currentUser?.username === message.author;
  const reactionsClassName = isCurrentUserAuthor ? 'my-reactions' : 'others-reactions';

  const editButton = (
    <div className='edit-my-message'>
      <button className='edit-message-btn' onClick={handleEdit}>Edit</button>
    </div>
  );

  return (
    <div className='message'>
      {isCurrentUserAuthor ? editButton : null}

      <div className='message-avatar'>
        {author.imgURL ?
          <img src={author.imgURL} alt='avatar' className='user-avatar-message' /> :
          <InitialsAvatar name={`${author.firstName} ${author.lastName}`} className={'avatar-default-header'} />
        }
      </div>

      <div className={isCurrentUserAuthor ? 'my-message' : 'others-message'}>
        <div className='message-author'>
          @{message.author}
        </div>

        <div className='message-content'>
          {message.content}
        </div>

        <div className='react-btns'>
          <button onClick={isCurrentUserAuthor ? undefined : handleYes} className={reactionsClassName}>{`${Reaction.YES} ${message.reactions.yes}`}</button>
          <button onClick={isCurrentUserAuthor ? undefined : handleNo} className={reactionsClassName}>{`${Reaction.NO} ${message.reactions.no}`}</button>
          <button onClick={isCurrentUserAuthor ? undefined : handleHeart} className={reactionsClassName}>{`${Reaction.HEART} ${message.reactions.heart}`}</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
