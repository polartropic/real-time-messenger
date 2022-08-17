import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import { getLiveTeamChannels, getTeamByName, manageTeamMembersUpdateUsers, updateTeamMembers } from '../../services/teams.services';
import { Team, User } from '../../types/Interfaces';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel } from '../../types/Interfaces';
import TeamParticipants from '../../components/TeamParticipants/TeamParticipants';
import ManiPulateUsersLists from '../../components/ManipulateUsersLists/ManiPulateUsersLists';
import { getAllUsers, updateUserChats } from '../../services/users.services';
import { toast } from 'react-toastify';
import { MIN_CHANNEL_NAME_LENGTH, MAX_CHANNEL_NAME_LENGTH, MIN_NUMBER_OF_CHAT_PARTICIPANTS } from '../../common/constants';
import { createTeamChat } from '../../services/channels.services';
import AppContext from '../../providers/AppContext';

// import './Team.css'

const MyTeam = (): JSX.Element => {
  const [team, setTeam] = useState<Team>({
    name: '',
    owner: '', // UserID
    members: [], // Users
    channels: [], // ChannelIDs
  });
  const [currentChat, setCurrentChat] = useState<IChannel>({
    id: '',
    title: '',
    participants: [], // UserIDs
    messages: [],
    isPublic: false,
    teamID: '',
  });
  const [isDetailedChatClicked, setIsDetailedChatClicked] = useState(false);
  const [isCreateChatClicked, setIsCreateChatClicked] = useState(false);
  const [chatList, setChatList] = useState<IChannel[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isDetailedTeamClicked, setIsDetailedTeamClicked] = useState<boolean>(false);

  const [teamMembersObjects, setTeamMembersObject] = useState<User[]>([]);
  const [addedToChat, setAddedToChat] = useState<User[]>([]);
  const [initialChatParticipants, setInitialChatParticipants] = useState<User[]>([]);
  const [teamProps, setTeamProps] = useState<Team>();
  const { name } = useParams<{ name: string }>();
  const { appState } = useContext(AppContext);
  const [outerUsers, setOuterUsers] = useState<User[]>([]);
  const [userstoRemove, setUsersToRemove] = useState<User[]>([]);
  const currentUser = appState.userData?.username;

  useEffect(() => {
    if (isCreateChatClicked) {
      setIsDetailedChatClicked(false);
      setIsDetailedTeamClicked(false);
    }
    if (isDetailedChatClicked) {
      setIsCreateChatClicked(false);
      setIsDetailedTeamClicked(false);
      setIsDetailedChatClicked(true);
    }
    if (isDetailedTeamClicked) {
      setIsDetailedChatClicked(false);
      setIsCreateChatClicked(false);
    }
  }, [isCreateChatClicked, isDetailedChatClicked, isDetailedTeamClicked]);

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const team: Team = snapshot.val();
          setTeam(team);
          setMembers(Object.values(team)[0].members);
          setTeamProps(Object.values(team)[0]);
        }
      })
      .catch(console.error);
  }, [name]);

  const teamID = Object.keys(team)[0];
  useEffect(() => {
    const unsubscribe = getLiveTeamChannels(teamID, (snapshot) => {
      setChatList(snapshot.val());
    });
    return () => unsubscribe();
  }, [teamID]);

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => {
        const usersObj: object = snapshot.val();
        console.log(members);
        const allUsersInTeam = Object.values(usersObj)
          .filter((userA) => [...members].includes(userA.username));
        setTeamMembersObject(allUsersInTeam);
        setUsersToRemove(allUsersInTeam);
        setInitialChatParticipants(allUsersInTeam);


        const allUsersOutOfTeam: User[] = Object.values(usersObj)
          .filter((userA) => ![...members, team.owner].includes(userA.username));
        console.log(allUsersOutOfTeam);
        setOuterUsers(allUsersOutOfTeam);
      });
  }, [members, team.owner]);

  const updateTeam = () => {
    const stringMembers = userstoRemove.map((member) => member.username);
    updateTeamMembers(teamID, stringMembers)
      .then(() => {
        manageTeamMembersUpdateUsers(outerUsers, userstoRemove, Object.values(team)[0], teamID);
      })
      .then(() => toast.success('You have succesfully updated your team!'))
      .catch((err) => toast.warning(err));
    // TODO not finished. I need to update somehow the teams of the deleted or added users...
  };

  const createChatFunc = () => {
    setIsDetailedTeamClicked(false);
    if (title.length < MIN_CHANNEL_NAME_LENGTH || title.length > MAX_CHANNEL_NAME_LENGTH) {
      return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
    }
    if (members.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
      return toast.warning('Please add at least one participant in the chat!');
    }
    if (teamID) {
      console.log(addedToChat);

      const membersToAdd = addedToChat.map((mem) => mem.username);

      createTeamChat(teamID, title, [...membersToAdd, currentUser!])
        .then(() => {
          toast.success('Successful chat creation!');
          [...members, currentUser!].map((participant) => updateUserChats(participant, title));
          setAddedToChat([]);
          setInitialChatParticipants(teamMembersObjects);
        });
    }
  };

  return (
    <div className='landing-page'>
      {team.channels ?
        <>
          <ChannelsList props={{ chatList, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat, setIsDetailedTeamClicked }} />
        </> :
        null}
      <ChannelsList props={{ chatList, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat, setIsDetailedTeamClicked }} />

      <div className='main-container'>
        <>
          {isCreateChatClicked ?
            <>
              <input type="text" className={'create-chat-title'} name="team-name" placeholder='Please, add a title...' required defaultValue='' onChange={(e) => setTitle(e.target.value.trim())} />
              <button className='create-a-team' onClick={createChatFunc}>Create a Chat</button>
              <ManiPulateUsersLists leftSide={initialChatParticipants}
                setLeftSide={setInitialChatParticipants}
                rightSide={addedToChat} setRightSide={setAddedToChat} />
            </> :
            null
          }
          {isDetailedChatClicked ?
            <Channel currentChannel={currentChat} /> :
            null
          }
          {isDetailedTeamClicked && Object.values(team)[0].owner === currentUser ?
            <>
              <h4>{team.name}</h4>
              <button className='create-a-team' onClick={updateTeam}>Update users</button>
              <ManiPulateUsersLists
                leftSide={outerUsers}
                setLeftSide={setOuterUsers}
                rightSide={userstoRemove}
                setRightSide={setUsersToRemove} />
            </> :
            null}
        </>
      </div>
      {
        isDetailedChatClicked ?
          <ChatParticipants currentChannel={currentChat} isDetailedChatClicked={isDetailedChatClicked}
            setIsDetailedChatClicked={setIsDetailedChatClicked} setIsDetailedTeamClicked={setIsDetailedTeamClicked} /> :
          <TeamParticipants team={teamProps} isDetailedChatClicked={isDetailedChatClicked}
            setIsDetailedChatClicked={setIsDetailedChatClicked}
          />
      }

    </div >
  );
};

export default MyTeam;
