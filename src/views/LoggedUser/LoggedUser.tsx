import './LoggedUser.css';
import { useContext, useEffect, useState } from 'react';
import { getAllUsers, getLiveChannelsByUsername, updateUserChats, updateUserStatus, updateUserTeams } from '../../services/users.services';
import AppContext from '../../providers/AppContext';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel, User } from '../../types/Interfaces';

// import Create from '../../components/Create/Create';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ManiPulateUsersLists from '../../components/ManipulateUsersLists/ManiPulateUsersLists';
import { MAX_CHANNEL_NAME_LENGTH, MAX_TEAM_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH, MIN_NUMBER_OF_CHAT_PARTICIPANTS, MIN_TEAM_NAME_LENGTH } from '../../common/constants';
import { toast } from 'react-toastify';
import { createChat, getChatByName } from '../../services/channels.services';
import { getTeamByName, addTeamToDB } from '../../services/teams.services';
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { UserStatus } from '../../common/user-status.enum';


const LoggedUser = (): JSX.Element => {
  const { appState,
    isCreateTeamView,
    isDetailedChatClicked,
    isCreateChatClicked,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsCreateTeamView,
  } = useContext(AppContext);
  const userDetails: User = appState.userData!;

  const [currentChat, setCurrentChat] = useState<IChannel>({
    id: '',
    title: '',
    participants: [], // UserIDs
    messages: [],
    isPublic: false,
    teamID: '',
  });
  const [channels, setChannels] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [initialParticipants, setInitialParticipants] = useState<User[]>([]);
  const [addedParticipants, setAddedParticipants] = useState<User[]>([]);
  const [title, setTitle] = useState<string>('');

  const navigate = useNavigate();
  useStatusTracking(userDetails);

  useEffect(() => {
    if (appState.userData?.username) {
      const unsubscribe = getLiveChannelsByUsername(appState.userData.username,
        (snapshot) => {
          setChannels(Object.keys(snapshot.val()));
        });
      return () => unsubscribe();
    }
  }, [appState.userData?.username]);

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => {
        const allUsers: User[] = Object.values(snapshot.val());
        setAllUsers(allUsers);
        setInitialParticipants(allUsers);
      })
      .catch(console.error);
  }, []);

  const createChatFunc = () => {
    if (title.length < MIN_CHANNEL_NAME_LENGTH || title.length > MAX_CHANNEL_NAME_LENGTH) {
      return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
    }
    if (addedParticipants.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
      return toast.warning('Please add at least one participant in the chat!');
    }
    const userIDs = addedParticipants.map((user) => user.username);
    getChatByName(title)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return toast.warning('This chat name is already taken! Please choose a different one.');
        } else {
          createChat(title, [...userIDs, userDetails?.username!])
            .then((res) => {
              setCurrentChat(res);
              toast.success('Successful chat creation!');
              setIsCreateChatClicked(!isCreateChatClicked);
              [...userIDs, userDetails?.username!].map((participant) => updateUserChats(participant, title));
            })
            .catch((err) => toast.warning(`Something went wrong  ${err.message}`));
          setInitialParticipants(allUsers);
          setAddedParticipants([]);
          setIsDetailedChatClicked(true);
          setTitle('');
        }
      });
  };

  const createTeam = () => {
    if (title.length < MIN_TEAM_NAME_LENGTH || title.length > MAX_TEAM_NAME_LENGTH) {
      return toast.warning(`The name of the team must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH} symbols`);
    }
    const owner = userDetails?.username;
    getTeamByName(title)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return toast.warning(`This name ${title} already exists!`);
        } else {
          const membersIds = addedParticipants.map((user) => user.username);
          addTeamToDB(title.trim(), owner!, membersIds)
            .then(() => {
              [...membersIds, owner].forEach((username) => updateUserTeams(username!, title));
              toast.success('You have successfully created a Team!');
            })
            .catch(console.error);
        }
      })
      .then(() => {
        setIsCreateTeamView(!isCreateTeamView);
        setTitle('');
        navigate(`/teams/${title}`);
      })
      .catch(console.error);
  };


  return (
    <div className="landing-page">
      <ChannelsList props={{ channels, setIsCreateChatClicked, setIsDetailedChatClicked, setIsCreateTeamView, setCurrentChat }} />

      {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
      <div className="main-container">
        <>
          {isCreateChatClicked ?
            <>
              <input type="text" className={'create-chat-title'} name="team-name" placeholder='Please, add a title...' required defaultValue='' onChange={(e) => setTitle(e.target.value.trim())} />
              <button className='create-a-team' onClick={createChatFunc}>Create a Chat</button>
              <ManiPulateUsersLists
                leftSide={initialParticipants}
                setLeftSide={setInitialParticipants}
                rightSide={addedParticipants}
                setRightSide={setAddedParticipants} />
            </> :
            null
          }
          {isDetailedChatClicked ?
            <Channel currentChannel={currentChat} /> :
            null
          }
          {isCreateTeamView ?
            <>
              <input type="text" className={'create-chat-title'} name="team-name" placeholder='Please, add a title...' required defaultValue='' onChange={(e) => setTitle(e.target.value.trim())} />
              <button className='create-a-team' onClick={createTeam}>Create a Team</button>
              <ManiPulateUsersLists
                leftSide={initialParticipants}
                setLeftSide={setInitialParticipants}
                rightSide={addedParticipants}
                setRightSide={setAddedParticipants} />
            </> :
            null

          }
        </>
      </div>
      <ChatParticipants currentChannel={currentChat} isDetailedChatClicked={isDetailedChatClicked}
        setIsDetailedChatClicked={setIsDetailedChatClicked} allUsers={allUsers} />
    </div>
  );
};

export default LoggedUser;

function useStatusTracking(loggedInUser: User) {
  useIdleTimer({
    onIdle: onIdle,
    onActive: onActive,
    onAction: onAction,
    timeout: 1000 * 5 });

  function onIdle() {
    updateUserStatus(loggedInUser.username, UserStatus.AWAY);
  };

  function onActive() {
    if (loggedInUser.status !== UserStatus.ONLINE) {
      updateUserStatus(loggedInUser.username, UserStatus.ONLINE);
    }
  };

  function onAction() {
    if (loggedInUser.status !== UserStatus.DO_NOT_DISTURB) {
      updateUserStatus(loggedInUser.username, UserStatus.ONLINE);
    }
  };
}
