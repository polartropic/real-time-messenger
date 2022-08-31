import { User } from '../types/Interfaces';
import { useIdleTimer } from 'react-idle-timer';
import { UserStatus } from '../common/user-status.enum';
import { updateUserStatus } from '../services/users.services';

export default function useStatusTracking(loggedInUser: User) {
  useIdleTimer({
    onIdle: onIdle,
    onActive: onActive,
    onAction: onAction,
    timeout: 1000 * 5 * 60,
  });

  function onIdle() {
    if (loggedInUser.status !== UserStatus.DO_NOT_DISTURB) {
      updateUserStatus(loggedInUser.username, UserStatus.AWAY).catch(console.error);
    }
  };

  function onActive() {
    if (loggedInUser.status !== UserStatus.DO_NOT_DISTURB && loggedInUser.status !== UserStatus.ONLINE) {
      updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
    }
  };

  function onAction() {
    if (loggedInUser.status === UserStatus.DO_NOT_DISTURB) {
      updateUserStatus(loggedInUser.username, UserStatus.DO_NOT_DISTURB).catch(console.error);
    } else {
      updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
    }
  };
}
