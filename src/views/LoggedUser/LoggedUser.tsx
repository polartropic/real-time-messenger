// import CreateTeam from '../Create-a-team/CreateTeam';
// import Channel from '../Channel/Channel';
import './LoggedUser.css';
import { User } from '../../types/Interfaces';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.services';
import UserComponent from '../../components/User/User';
// import Channel from '../Channel/Channel';

const LoggedUser = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAllUsersClicked, setisAllUsersClicked] = useState(false);

  useEffect(() => {
    getAllUsers()
      .then((snapshot) => setAllUsers(Object.values(snapshot.val())));
  }, []);

  const getUsersBySearchTerm = (searchTerm: string, users: User[]) => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm));
  };

  const result = getUsersBySearchTerm(searchTerm, allUsers);


  const mappingResult = (user: User): JSX.Element | undefined => {
    const buttonEl: JSX.Element =
      <button onClick={() => {}}
        id='add-remove-user-btn'>
        <img src="https://img.icons8.com/color/48/000000/add--v1.png" alt='add-btn' />
      </button>;
    return <>
      <UserComponent props={{ user, buttonEl }} key={user.uid} />
      <br />
    </>;
  };

  return (
    <div className="landing-page">
      <div className="chats-channels-list">
        <div className="search-users">
          <input type="text" defaultValue="" placeholder='search users...' onChange={(event) => setSearchTerm(event.target.value)}/>
          <button className="view-users-btn" onClick={() =>setisAllUsersClicked(!isAllUsersClicked)}>View all users</button>
        </div>

        <h4>Chats:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>
      </div>

      {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
      <div className="main-container">
        <>
          {searchTerm !== '' ?
            result.map(mappingResult) :
            null
          }
          {isAllUsersClicked ?
            allUsers.map(mappingResult) :
            null

          }
          {/* <CreateTeam/> */}
          {/* <Channel /> */}
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
          <button className="leave-btn">Leave channel</button>
        </div>
      </div>
    </div>
  );
};

export default LoggedUser;
