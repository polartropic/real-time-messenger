import { ReactNode, useContext, useEffect, useState } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { logOut } from '../../services/auth.services';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getUserByUsername } from '../../services/users.services';
import { getAllTeams } from '../../services/teams.services';
import { Link } from 'react-router-dom';
import './Header.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uid } from 'uid';

const Header = (): JSX.Element => {
  const { appState,
    setState,
    setIsCreateTeamView,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
  } = useContext(AppContext);
  const user = appState.user;
  const userUsername = appState.userData?.username;
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then((users) => setUsersCount(users.size))
      .catch(console.error);

    getAllTeams()
      .then((teams) => setTeamsCount(teams.size))
      .catch(console.error);
  }, []);

  useEffect(() => {
    getUserByUsername(userUsername!)
      .then((res) => setUserDetails(res.val()))
      .catch(console.error);
  }, [userUsername]);

  const handleLogOut = () => {
    setState({
      user: null,
      userData: null,
    });

    logOut();

    toast.success('Successful sign out!');
    navigate('/');
  };

  const toggling = () => setIsOpen(!isOpen);


  const mappingTeam = (team: ReactNode, key: string | number) => {
    key = uid();
    return <>
      <Link to={`/teams/${team}`} >
        <p key={key} onClick={() => setIsOpen(!isOpen)} className='team-item'>{team}</p>
      </Link>
    </>;
  };

  const handleCreateTeam = () => {
    setIsOpen(!isOpen);
    setIsCreateTeamView(true);
    setIsCreateChatClicked(false);
    setIsDetailedChatClicked(false);
  };

  return (
    <>
      <header id='header'>
        <div id='stats'>
          <h4 className='stats'>Total active users: {usersCount}</h4>
          <h4 className='stats'>Total active teams: {teamsCount}</h4>
        </div>

        <div id='navigation'>
          <button className='header-btn' onClick={() => navigate('/')}>Home</button>
          <button className='header-btn' onClick={() => navigate('/about-us')}>About us</button>

          {user ?
            <>
              <button className='header-btn' onClick={toggling}>My teams</button>
              {isOpen &&
                <div id='dropdown-menu-myteams'>
                  {Object.keys(userDetails.teams).map((team, key) => mappingTeam(team, key))}
                  <button id='create-a-team-btn-header' onClick={handleCreateTeam}>Create a team</button>
                </div>

              }
              <button onClick={handleLogOut} className='header-btn'>Log out</button>
              <Link to={'/edit-profile'}>
                <img className="default-avatar" src={DefaultAvatar} alt="default-avatar" />
              </Link>
            </> :
            null
          }
        </div>
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;
