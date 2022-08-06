import React, { useContext, useState, useEffect } from 'react';
import { MAX_TEAM_NAME_LENGTH, MIN_TEAM_NAME_LENGTH } from '../../common/constants';
import UserComponent from '../../components/User/User';
import AppContext from '../../providers/AppContext';
import { getTeamByName } from '../../services/teams.services';
import { getAllUsers } from '../../services/users.services';
import { Team, User } from '../../types/Interfaces';

import './Create-team.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTeam = (): JSX.Element => {
  const [teamDetails, setTeamDetails] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: [],
    channels: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [addedUsers, setAddedUsers] = useState<User[]>([]);
  useEffect(() => {
    getAllUsers()
      .then((snapshot) => setAllUsers(Object.values(snapshot.val())));
  }, []);

  const { appState } = useContext(AppContext);

  const updateForm = (prop: string) => (e: React.FormEvent<HTMLInputElement>) => {
    setTeamDetails({
      ...teamDetails,
      [prop]: e.currentTarget.value,
    });
  };

  const createTeam: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (teamDetails.name.length < MIN_TEAM_NAME_LENGTH || teamDetails.name.length > MAX_TEAM_NAME_LENGTH) {
      return toast.warning('The name of the team must be between 3 and 40 symbols');
    }

    getTeamByName(teamDetails.name)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return toast.warning(`This name ${teamDetails.name} already exists!`);
        }
        const currentUser = appState?.userData?.username;
        if (currentUser) {
          setTeamDetails({
            ...teamDetails,
            owner: currentUser,
          });
        };
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
    ] );
  };

  const mappingUser = (user: User): JSX.Element => {
    console.log(user.uid);

    return <> <UserComponent props={{ user }} key={user.uid} /><br /></>;
  };

  const mappingUserAddButton = (user: User): JSX.Element => {
    const buttonEl: JSX.Element =
      <button onClick={() => {
        handleAddUser(user);
      }} id='add-remove-user-btn'>
        <img src="https://img.icons8.com/color/48/000000/add--v1.png" alt='add-btn' />
      </button>;

    return <>
      <UserComponent props={{ user, buttonEl }} key={user.uid} />

      <br />
    </>;
  };

  const mappingUserRemoveButton = (user: User): JSX.Element => {
    const buttonEl: JSX.Element =
      <button onClick={() => {
        handleRemoveUser(user);
      }} id='add-remove-user-btn'>
        <img src="https://img.icons8.com/color/48/000000/delete-forever.png" alt='remove-btn' />
      </button>;

    return <>
      <UserComponent props={{ user, buttonEl }} key={user.uid} />

      <br />
    </>;
  };


  return (
    <div className="create-team-view">
      <div className='create-team-wrapper'>
        <form id="create-team-form" onSubmit={createTeam}>
          <h4 id="create-team-title">Create a new team</h4>
          <label htmlFor="first-name">Name of the Team:</label><br />
          <br />
          <input type="text" className="create-team-title" name="team-name" placeholder="name of your new Team" required defaultValue='' onChange={updateForm('team-name')} /> <br /> <br />
          <div className="search-users-create-team">
            <input type="text" defaultValue="" placeholder='search Users...' onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
        </form>
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
        <h4>Added users to your Team</h4>
        {addedUsers.map(mappingUserRemoveButton)}


      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateTeam;
