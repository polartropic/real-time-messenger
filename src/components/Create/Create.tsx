import React, { useContext, useState, useEffect } from 'react';
import { MAX_CHANNEL_NAME_LENGTH, MAX_TEAM_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH, MIN_NUMBER_OF_CHAT_PARTICIPANTS, MIN_TEAM_NAME_LENGTH } from '../../common/constants';
import UserComponent from '../../components/User/User';
import AppContext from '../../providers/AppContext';
import { addTeamToDB, getTeamByName } from '../../services/teams.services';
import { getAllUsers, updateUserChats, updateUserTeams } from '../../services/users.services';
import { User } from '../../types/Interfaces';
import { ToastContainer, toast, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { createChat, createTeamChat } from '../../services/channels.services';
import { uid } from 'uid';
import './Create.css';

const Create = ({ props }: any): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const { appState, isCreateTeamView, setIsCreateTeamView } = useContext(AppContext);

  const currentUser = appState.userData?.username;
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => {
        if (props.teamID) {
          if (!props.members) {
            setAllUsers([]);
          } else {
            const allUsers: User[] = Object.values(snapshot.val());
            const teamUsers = allUsers.filter((user: User) => props.members.includes(user.username));
            setAllUsers(teamUsers);
          }
        } else {
          setAllUsers(Object.values(snapshot.val()));
        }
      })
      .catch(console.error);
  }, [props.members, props.teamID]);

  useEffect(() => {
    setOwner(currentUser!);
  }, [currentUser]);

  const createTeam: React.MouseEventHandler<HTMLButtonElement> = (): Id | void => {
    if (name.length < MIN_TEAM_NAME_LENGTH || name.length > MAX_TEAM_NAME_LENGTH) {
      return toast.warning(`The name of the ${props.string} must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH} symbols`);
    }

    getTeamByName(name)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return toast.warning(`This name ${name} already exists!`);
        } else {
          const membersIds = addedUsers.map((user) => user.username);
          addTeamToDB(name.trim(), owner, membersIds)
            .then(() => {
              [...membersIds, owner].forEach((username) => updateUserTeams(username, name));
              toast.success('You have successfully created a Team!');
            })
            .catch(console.error);
        }
      })
      .then(() => {
        setIsCreateTeamView(!isCreateTeamView);
        navigate(`/teams/${name}`);
      })
      .catch(console.error);
  };

  const getUsersBySearchTerm = (searchTerm: string, users: User[]) => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm));
  };

  const result = getUsersBySearchTerm(searchTerm, allUsers);

  const handleAddUser = (user: User): void => {
    setAddedUsers([
      ...addedUsers,
      user,
    ]);
    setAllUsers(allUsers.filter((u) => u.uid !== user.uid));
  };

  const handleRemoveUser = (user: User): void => {
    setAddedUsers(addedUsers.filter((u) => u.uid !== user.uid));
    setAllUsers([
      ...allUsers,
      user,
    ]);
  };

  const createChatFunc = (chatName: string, participants: User[]) => {
    if (name.length < MIN_CHANNEL_NAME_LENGTH || name.length > MAX_CHANNEL_NAME_LENGTH) {
      return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
    }
    if (participants.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
      return toast.warning('Please add at least one participant in the chat!');
    }
    if (props?.teamID) {
      createTeamChat(props.teamID, chatName, [...props.members, currentUser!])
        .then(() => {
          toast.success('Successful chat creation!');
          setSearchTerm('');
          props.setIsCreateChatClicked(!props.isCreateChatClicked);
          [...props.members, currentUser!].map((participant) => updateUserChats(participant, chatName));
        });
    } else {
      const userIDs = participants.map((user) => user.username);

      createChat(chatName, [...userIDs, currentUser!])
        .then(() => {
          toast.success('Successful chat creation!');
          setSearchTerm('');
          props.setIsCreateChatClicked(!props.isCreateChatClicked);
          [...userIDs, currentUser!].map((participant) => updateUserChats(participant, chatName));
        })
        .catch(console.error);
    }
  };

  const mappingUserAddButton = (user: User): JSX.Element | undefined => {
    const buttonEl: JSX.Element =
      <button onClick={() => {
        handleAddUser(user);
      }} id='add-remove-user-btn'>
        <img src="https://img.icons8.com/color/48/000000/add--v1.png" alt='add-btn' />
      </button>;
    if (user.username !== currentUser) {
      return <div key={uid()}>
        <UserComponent props={{ user, buttonEl }} />
      </div>;
    }
  };

  const mappingUserRemoveButton = (user: User): JSX.Element | undefined => {
    const buttonEl: JSX.Element =
      <button onClick={() => {
        handleRemoveUser(user);
      }} id='add-remove-user-btn'>
        <img src="https://img.icons8.com/color/48/000000/delete-forever.png" alt='remove-btn' />
      </button>;
    if (user.username !== currentUser) {
      return <div key={uid()}>
        <UserComponent props={{ user, buttonEl }} />
      </div>;
    }
  };

  const handleGoBack = () => {
    if (props.string) {
      setIsCreateTeamView(!isCreateTeamView);
    } else {
      props.setIsCreateChatClicked(!props.isCreateChatClicked);
    }
  };

  return (
    <div className="create-team-view">
      <div className='create-team-wrapper'>
        <button onClick={handleGoBack} className='go-back-btn'>
          <img src="https://firebasestorage.googleapis.com/v0/b/thunderteam-99849.appspot.com/o/icons8-go-back-48.png?alt=media&token=7bdfef4c-cf94-4147-8f4d-fc55fd086b4a" alt='go-back-icon' />
        </button>
        <div id="create-team-form" >
          <h4 id="create-team-title">Create a new {props.string || 'chat'}</h4>
          <div className="search-users-create-team">
            <input type="text" defaultValue="" placeholder='search Users...' onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
        </div>
        <div className='users-container'>
          {searchTerm ?
            result.length > 0 ?
              result.map(mappingUserAddButton) :
              <p>No users found</p> :
            allUsers.map(mappingUserAddButton)
          }
        </div>
      </div>
      <div className='list-of-added-participants'>
        <label htmlFor="name-of-the-team">Name:</label><br />
        <br />
        <input type="text" className={'create-chat-title'} name="team-name" placeholder={'name'} required defaultValue='' onChange={(e) => setName(e.target.value.trim())} /> <br /> <br />

        <h4>Added users:</h4>
        {addedUsers.map(mappingUserRemoveButton)}
        {
          props.string === 'team' ?
            <button className='create-a-team' onClick={createTeam}>Create team</button> :
            <button className='create-a-team' onClick={() => createChatFunc(name, addedUsers)}>Create a Chat</button>
        }

      </div>
      <ToastContainer />
    </div>
  );
};

export default Create;
