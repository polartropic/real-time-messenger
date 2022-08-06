import { useContext, useEffect, useState } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { logOut } from '../../services/auth.services';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/users.services';
import { getAllTeams } from '../../services/teams.services';
import { Link } from 'react-router-dom';
import './Header.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = (): JSX.Element => {
  const { appState, setState } = useContext(AppContext);
  const user = appState.user;

  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then((users) => setUsersCount(users.size))
      .catch(console.error);

    getAllTeams()
      .then((teams) => setTeamsCount(teams.size))
      .catch(console.error);
  }, []);

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

  return (
    <>
      <header id='header'>
        <div id='stats'>
          <h4 className='stats'>Total active users: {usersCount}</h4>
          <h4 className='stats'>Total active teams: {teamsCount}</h4>
        </div>

        <div id='navigation'>
          <button className='header-btn' onClick={() => navigate('/about-us')}>About us</button>

          {user ?
            <>
              <button className='header-btn' onClick={toggling}>My teams</button>
              {isOpen&&
              <div id='dropdown-menu-myteams'>
                <p className='team-item'>Mega Team</p>
                <p className='team-item'>Giga Team</p>
                <p className='team-item'>Top Team</p>
                <Link to={'/create-team'}>
                  <button id='create-a-team-btn-header'>Create a team</button>
                </Link>
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
      <ToastContainer/>
    </>
  );
};

export default Header;
