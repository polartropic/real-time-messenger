import { useEffect, useState } from 'react';
import { UserStatus as UserStatusEnum } from '../../common/user-status.enum';
import { getLiveStatus } from '../../services/users.services';
import { User } from '../../types/Interfaces';
import './UserStatusIndicator.css';

interface UserStatusProps {
  user: User,
}

const UserStatusIndicator = ({ user }: UserStatusProps) => {
  const [color, setColor] = useState('');

  useEffect(() => {
    const unsubscribe = getLiveStatus(user.username, (snapshot) => {
      const currentStatusInDB = snapshot.val();

      if (currentStatusInDB === UserStatusEnum.ONLINE) setColor('green');
      if (currentStatusInDB === UserStatusEnum.AWAY) setColor('yellow');
      if (currentStatusInDB === UserStatusEnum.OFFLINE) setColor('gray');
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <span className='user-status' style={{ backgroundColor: color }}></span>
  );
};

export default UserStatusIndicator;

