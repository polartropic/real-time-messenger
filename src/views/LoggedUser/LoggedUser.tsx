import './LoggedUser.css';
import { useContext, useEffect, useState } from 'react';
import { getUserByUsername } from '../../services/users.services';
import { getChatById, getChatByName } from '../../services/channels.services';
import AppContext from '../../providers/AppContext';
import Channel from '../Channel/Channel';
import Create from '../../components/Create/Create';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';


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


  const mappingChats = (chat: string) => {
    return <>
      <p onClick={() => openDetailedChat(chat)} className='chat-item'>{chat}</p>
    </>;
  };

  const openCreateChat = () => {
    setIsCreateChatClicked(true);
    setIsDetailedChatClicked(false);
    setIsCreateTeamView(false);
  };

  const openDetailedChat = (chat: string) => {
    setIsDetailedChatClicked(true);
    setIsCreateChatClicked(false);
    getChatByName(chat)
      .then((res) => Object.keys(res.val()))
      .then((res) => getChatById(res[0]))
      .then((res) => setCurrentChat(res))
      .catch(console.error);
  };

  return (
    <div className="landing-page">
      <div className="chats-channels-list">
        <button onClick={openCreateChat} className='view-users-btn'>Create a Chat</button>
        <h4>Chats:</h4>
        {Object.keys(userDetails.channels).map((chat) => mappingChats(chat))}
      </div>

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
