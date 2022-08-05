import React, { useContext, useState, useEffect } from 'react';
import { MAX_TEAM_NAME_LENGTH, MIN_TEAM_NAME_LENGTH } from '../../common/constants';
import AppContext from '../../providers/AppContext';
import { getTeamByName } from '../../services/teams.services';
import { getAllUsers } from '../../services/users.services';
import { Team, User } from '../../types/Interfaces';


const CreateTeam = (): JSX.Element => {
  const [teamDetails, setTeamDetails] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: [],
    channels: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => setAllUsers(Object.values(snapshot.val())));
  }, []);


  const { appState } = useContext(AppContext);

  // console.log(appState);


  const updateForm = (prop: string) => (e: React.FormEvent<HTMLInputElement>) => {
    setTeamDetails({
      ...teamDetails,
      [prop]: e.currentTarget.value,
    });
  };

  const createTeam: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    if (teamDetails.name.length < MIN_TEAM_NAME_LENGTH || teamDetails.name.length > MAX_TEAM_NAME_LENGTH) {
      return alert('The name of the team must be between 3 and 40 symbols');
    }


    getTeamByName(teamDetails.name)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return alert(`This name ${teamDetails.name} already exists!`);
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
      user.email.toLowerCase().includes(searchTerm));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    const result = getUsersBySearchTerm(searchTerm, allUsers);
    setFilteredUsers(result);
    console.log(filteredUsers);
  };

  return (
    <div className="create-a-team">
      <form id="register-form" onSubmit={createTeam}>
        <h4 id="create-team-title">Create a new team</h4>
        <label htmlFor="first-name">Name of the Team:</label>
        <br />
        <input type="text" className="register-field" name="team-name" placeholder="name of your new Team" required defaultValue='' onChange={updateForm('team-name')} /> <br /> <br />
        <div className="search-users">
          <input type="text" defaultValue="" placeholder='search Users...' onChange={handleSearch} />
        </div>
      </form>
      <div className='users-container'>
        {/* {filteredUsers.length > 0 ?
          filteredUsers.map((user, key) => {
            return
            <>
              <h5>{user.username}</h5>
            </>
          }) :
          <p>No users found</p>
        } */}
      </div>
    </div>
  );
};

export default CreateTeam;