import { useContext } from 'react';
import AppContext from '../../providers/AppContext';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './Message.css';

const Message = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  return (
    <div id="message" className="message">
      <img src={DefaultAvatar} alt="avatar" className="default-avatar" />
      @{user?.username}
      <br />Single message goes here.....
      <br />Sent on: 07.08.22 5:00 pm
    </div>
  );
};

export default Message;
