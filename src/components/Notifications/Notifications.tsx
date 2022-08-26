import { useEffect, useState } from 'react';
import { getLiveNotifications } from '../../services/channels.services';
import { ChannelProps } from '../../types/Interfaces';
import './Notifications.css';

const Notifications = ({ currentChannel }: ChannelProps) => {
  const [notif, setNotif] = useState(false);
  // const [messagesCount, setMessagesCount] = useState(undefined);
  const [lastActivity, setLastActivity] = useState(currentChannel.lastActivity);

  return (
    <>
      {notif ?
        <span className='notif-icon'><i className='fa-solid fa-bell'></i></span> :
        null
      }
    </>
  );
};

export default Notifications;
