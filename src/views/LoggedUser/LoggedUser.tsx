import './LoggedUser.css';
import { useContext, useEffect, useState } from 'react';
import { getAllUsers, getLiveChannelsByUsername, updateUserChats, updateUserTeams } from '../../services/users.services';
import AppContext from '../../providers/AppContext';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel, User } from '../../types/Interfaces';

// import Create from '../../components/Create/Create';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ManiPulateUsersLists from '../../components/ManipulateUsersLists/ManiPulateUsersLists';
import { MAX_CHANNEL_NAME_LENGTH, MAX_TEAM_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH, MIN_NUMBER_OF_CHAT_PARTICIPANTS, MIN_TEAM_NAME_LENGTH } from '../../common/constants';
import { toast } from 'react-toastify';
import { createChat } from '../../services/channels.services';
import { getTeamByName, addTeamToDB } from '../../services/teams.services';
import { useNavigate } from 'react-router-dom';


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
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [initialParticipants, setInitialParticipants] = useState<User[]>([]);
  const [addedParticipants, setAddedParticipants] = useState<User[]>([]);
  const [title, setTitle] = useState<string>('');
  const navigate = useNavigate();

  // const string = 'team';

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => {
        const allUsers: User[] = Object.values(snapshot.val());
        setAllUsers(allUsers);
        setInitialParticipants(allUsers);
      })
      .catch(console.error);
  }, []);


  useEffect(() => {
    if (userDetails?.username != null) {
      const unsubscribe = getLiveChannelsByUsername(userDetails.username, (snapshot) => {
        setChannels(snapshot.val());
      });
      return () => unsubscribe();
    }
  }, [userDetails?.username]);

  const createChatFunc = () => {
    if (title.length < MIN_CHANNEL_NAME_LENGTH || title.length > MAX_CHANNEL_NAME_LENGTH) {
      return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
    }
    if (addedParticipants.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
      return toast.warning('Please add at least one participant in the chat!');
    }

    const userIDs = addedParticipants.map((user) => user.username);
    createChat(title, [...userIDs, userDetails?.username!])
      .then(() => {
        toast.success('Successful chat creation!');
        setIsCreateChatClicked(!isCreateChatClicked);
        [...userIDs, userDetails?.username!].map((participant) => updateUserChats(participant, title));
      })
      .catch((err) => toast.warning(`Something went wrong  ${err.message}`));
    setInitialParticipants(allUsers);
    setAddedParticipants([]);
    setIsDetailedChatClicked(true);
    setTitle('');
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
            // <Create props={{
            //   isCreateChatClicked,
            //   setIsCreateChatClicked,
            // }} /> :
            // null
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
            // <Create props={{
            //   isCreateChatClicked,
            //   setIsCreateChatClicked,
            //   string,
            // }} /> :
            // null
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
        setIsDetailedChatClicked={setIsDetailedChatClicked} />
    </div>
  );
};

export default LoggedUser;
