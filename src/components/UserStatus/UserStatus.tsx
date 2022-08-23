import { useContext, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { userStatus } from '../../common/user-status.enum';
import AppContext from '../../providers/AppContext';
import { updateUserStatus } from '../../services/users.services';
import './UserStatus.css';

const UserStatus = () => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  const [color, setColor] = useState('');

  const onIdle = () => {
    setColor('yellow');
    updateUserStatus(user?.username, userStatus.AWAY);
  };

  const onActive = () => {
    if (user?.status !== userStatus.ONLINE || user?.status !== userStatus.DO_NOT_DISTURB || user.status !== userStatus.IN_A_MEETING) {
      setColor('green');
      updateUserStatus(user?.username, userStatus.ONLINE);
    }
  };

  const onAction = () => {
    if (user?.status !== userStatus.DO_NOT_DISTURB || user.status !== userStatus.IN_A_MEETING) {
      setColor('green');
      updateUserStatus(user?.username, userStatus.ONLINE);
    }

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      setColor('gray');
      updateUserStatus(user?.username, userStatus.OFFLINE);
    });
  };

  const idleTimer = useIdleTimer({ onIdle, onActive, onAction, timeout: 1000 * 300 });

  return (
    <span className='user-status' style={{ backgroundColor: color }}></span>
  );
};

export default UserStatus;
