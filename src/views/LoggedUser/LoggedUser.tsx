import './LoggedUser.css';
import { useContext, useEffect, useState } from 'react';
import { getUserByUsername } from '../../services/users.services';
import AppContext from '../../providers/AppContext';
import Channel from '../Channel/Channel';
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
  const userUsername = appState.userData?.username;
  const [currentChat, setCurrentChat] = useState({
    date: {},
    id: '',
    isPublic: false,
    participants: [],
    title: '',
  });
  const string = 'team';

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    imgURL: '',
    teams: [],
    channels: [],
    uid: '',
  });

  useEffect(() => {
    getUserByUsername(userUsername!)
      .then((res) => setUserDetails(res.val()))
      .catch(console.error);
  }, [userUsername]);

  return (
    <div className="landing-page">
      <ChannelsList props={{ userDetails, setIsCreateChatClicked, setIsDetailedChatClicked, setIsCreateTeamView, setCurrentChat }}/>

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
      <ChatParticipants currentChannel={currentChat}/>
    </div>
  );
};

export default LoggedUser;
