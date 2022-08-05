import { useContext } from 'react';
import AppContext from '../../providers/AppContext';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './User.css';

const User = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  return (
    <div className="user-box" id="user-box">
      {<img src={user?.imgURL} alt="avatar" /> && <img src={DefaultAvatar} alt="avatar" />}
      <p>{user?.firstName} {user?.lastName}</p>
      <p>@{user?.username}</p>
    </div>
  );
};

export default User;
