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

  const mappingUser = (user: User): JSX.Element => {
    return <> <UserComponent props={user} key={user.uid} /><br /></>;
  };

  return (
    <div className="participants-list">
      <form id="participants-list" onSubmit={createTeam}>
        <h4 id="create-team-title">Create a new team</h4>
        <label htmlFor="first-name">Name of the Team:</label>
        <br />
        <input type="text" className="register-field" name="team-name" placeholder="name of your new Team" required defaultValue='' onChange={updateForm('team-name')} /> <br /> <br />
        <div className="search-users">
          <input type="text" defaultValue="" placeholder='search Users...' onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
      </form>
      <div className='users-container'>
        {searchTerm ?
          result.length > 0 ?
            result.map(mappingUser) :
            <p>No users found</p> :
          allUsers.map(mappingUser)
        }
      </div>
      <ToastContainer/>
    </div>
  );
};

export default CreateTeam;
