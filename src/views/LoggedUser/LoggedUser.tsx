import './LoggedUser.css';
import { User } from '../../types/Interfaces';
import { useContext, useEffect, useState } from 'react';
import { getAllUsers, getUserByUsername } from '../../services/users.services';
import UserComponent from '../../components/User/User';
import { deleteUserFromChat, getChatById, getChatByName } from '../../services/channels.services';
import AppContext from '../../providers/AppContext';
import Channel from '../Channel/Channel';
import { ToastContainer, toast } from 'react-toastify';
import Create from '../../components/Create/Create';


const LoggedUser = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;

  const [isAllUsersClicked, setisAllUsersClicked] = useState(false);
  const [isDetailedChatClicked, setisDetailedChatClicked] = useState(false);
  const [isCreateChatClicked, setisCreateChatClicked] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    date: {},
    id: '',
    isPublic: false,
    participants: [],
    title: '',
  });
  const string = 'chat';
  console.log(currentChat);
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
    setisCreateChatClicked(true);
    setisAllUsersClicked(false);
    setisDetailedChatClicked(false);
  };

  const openDetailedChat = (chat: string) => {
    setisDetailedChatClicked(true);
    setisCreateChatClicked(false);
    setisAllUsersClicked(false);
    getChatByName(chat)
      .then((res) => Object.keys(res.val()))
      .then((res) => getChatById(res[0]))
      .then((res) => setCurrentChat(res))
      .catch(console.error);
  };

  const leaveChat = (username: string | undefined, chatName: string) => {
    deleteUserFromChat(username, chatName)
      .then(() => {
        toast.success(`You have successfully been removed from chat ${chatName}!`);
      });
  };

  return (
    <div className="landing-page">
      <div className="chats-channels-list">
        <h4>Chats:</h4>
        {Object.keys(userDetails.channels).map((chat) => mappingChats(chat))}
        <button onClick={() => openCreateChat()} className='view-users-btn'>Create a Chat</button>
      </div>

      {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
      <div className="main-container">
        <>
          {isCreateChatClicked ?
            // this should be create chat comp
            <Create props={{
              isCreateChatClicked,
              setisCreateChatClicked,
              string,
            }} /> :
            null
          }
          {/* {searchTerm !== '' ?
            result.map(mappingResult) :
            null
          } */}
          {/* {isAllUsersClicked ?
            allUsers.map(mappingResult) :
            null

          } */}
          {isDetailedChatClicked ?
            <Channel /> :
            null
          }
        </>
      </div>

      <div className="participants-list">
        <h4>Owner:</h4>
        <p>User0</p>

        <h4>Participants of chat/team:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>

        <div className="manage-participants-btns">
          <button className="add-btn"><span>Add members</span></button>
          <br />
          <button onClick={() => leaveChat(userUsername, currentChat.title)} className="leave-btn">Leave channel</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoggedUser;
