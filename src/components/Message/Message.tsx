import { useContext, useEffect, useState } from 'react';
import InitialsAvatar from 'react-initials-avatar';
import { Reaction } from '../../common/reactions.enum';
import AppContext from '../../providers/AppContext';
import { likeMessage, unlikeMessage } from '../../services/messages.services';
import { getUserByUsername } from '../../services/users.services';
import { MessageProps, User } from '../../types/Interfaces';
import './Message.css';

const Message = ({ message, currentChannel, handleEditMessage, toBeEdited }: MessageProps): JSX.Element => {
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

  const handleLike = () => {
    likeMessage(currentChannel.id, message.id, currentUser?.username!);
  };

  const handleDislike = () => {
    unlikeMessage(currentChannel.id, message.id, currentUser?.username!);
  };

  const handleEdit = () => {
    handleEditMessage(message);
  };

  const isCurrentUserAuthor = currentUser?.username === message.author;

  const editButton = (
    <div className='edit-my-message'>
      <button className='edit-message-btn' onClick={handleEdit}>Edit</button>
    </div>
  );

  return (
    <div className={toBeEdited ? 'edit' : 'message'}>
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
        {message.image ?
          <img src={message.fileURL} className='img-in-message' alt='message-img' /> :
          <div className='message-content'>
            {message.content}
          </div>
        }

        <div className='react-btns'>
          <button
            onClick={Object.values(message.likedBy).includes(currentUser?.username!) ? handleDislike : handleLike}
            className='reactions'>{`${Object.values(message.likedBy).includes(currentUser?.username!) ? Reaction.HEART2 : Reaction.HEART1} ${Object.values(message.likedBy).length}`}
          </button>
        </div>
      </div>
    </div >
  );
};

export default Message;
