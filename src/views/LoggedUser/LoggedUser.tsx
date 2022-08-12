import './LoggedUser.css';
import { useContext, useEffect, useState } from 'react';
import { getLiveChannelsByUsername } from '../../services/users.services';
import AppContext from '../../providers/AppContext';
import Channel from '../Channel/Channel';
import { Channel as IChannel, User } from '../../types/Interfaces';

import Create from '../../components/Create/Create';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import ChannelsList from '../../components/ChannelsList/ChannelsList';


const LoggedUser = (): JSX.Element => {
  const { appState,
    isCreateTeamView,
    isDetailedChatClicked,
    isCreateChatClicked,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsCreateTeamView,
  } = useContext(AppContext);
  const userDetails: User | null = appState.userData;

  const [currentChat, setCurrentChat] = useState<IChannel>({
    id: '',
    title: '',
    participants: [], // UserIDs
    messages: [],
    isPublic: false,
    teamID: '',
  });
  const [channels, setChannels] = useState<IChannel []>([]);

  const string = 'team';

  useEffect(() => {
    if (userDetails?.username != null) {
      const unsubscribe = getLiveChannelsByUsername(userDetails.username, (snapshot) => {
        setChannels(snapshot.val());
      });
      return () => unsubscribe();
    }
  }, [userDetails?.username]);

  return (
    <div className="landing-page">
      <ChannelsList props={{ channels, setIsCreateChatClicked, setIsDetailedChatClicked, setIsCreateTeamView, setCurrentChat }}/>

      {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
      <div className="main-container">
        <>
          {isCreateChatClicked ?
            <Create props={{
              isCreateChatClicked,
              setIsCreateChatClicked,
            }} /> :
            null
          }
          {isDetailedChatClicked ?
            <Channel currentChannel={currentChat}/> :
            null
          }
          {isCreateTeamView ?
            <Create props={{
              isCreateChatClicked,
              setIsCreateChatClicked,
              string,
            }} /> :
            null
          }
        </>
      </div>
      <ChatParticipants currentChannel={currentChat} isDetailedChatClicked={isDetailedChatClicked}/>
    </div>
  );
};

export default LoggedUser;
