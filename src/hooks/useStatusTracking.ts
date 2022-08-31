import { User } from '../types/Interfaces';
import { useIdleTimer } from 'react-idle-timer';
import { UserStatus } from '../common/user-status.enum';
import { getLiveStatus, updateUserStatus } from '../services/users.services';
import { useContext, useEffect } from 'react';
import AppContext from '../providers/AppContext';

export default function useStatusTracking(loggedInUser: User) {
  const { setState } = useContext(AppContext);

  useIdleTimer({
    onIdle: onIdle,
    onActive: onActive,
    onAction: onAction,
    timeout: 1000 * 5 * 60,
  });

  useEffect(() => {
    const unsubscribe = getLiveStatus(loggedInUser.username, (snapshot) => {
      setState((currentState) => {
        currentState.userData!.status = snapshot.val();
        return currentState;
      });
    });

    return () => unsubscribe();
  }, [loggedInUser, setState]);

  function onIdle() {
    if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
      return;
    }

    updateUserStatus(loggedInUser.username, UserStatus.AWAY).catch(console.error);
  };

  function onActive() {
    if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
      return;
    }

    updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
  };

  function onAction() {
    if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
      return;
    }

    updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
  };
}
