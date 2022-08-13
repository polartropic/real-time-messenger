import { ReactNode, useContext, useEffect, useState } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { logOut } from '../../services/auth.services';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsersLive, getLiveTeamsByUsername } from '../../services/users.services';
import { getAllTeamsLive } from '../../services/teams.services';
import { Link } from 'react-router-dom';
import './Header.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uid } from 'uid';
import { Team } from '../../types/Interfaces';

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
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getAllUsersLive((snapshot) => {
      setUsersCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getAllTeamsLive((snapshot) => {
      setTeamsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userUsername !== undefined) {
      const unsubscribe = getLiveTeamsByUsername(userUsername, (snapshot) => {
        setTeams(snapshot.val());
      });
      return () => unsubscribe();
    }
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

  const URL = window.location.href;

  const mappingTeam = (team: ReactNode, key: string | number) => {
    return <div key={key}>
      <Link to={`/teams/${team}`} >
        <p key={key} onClick={() => setIsOpen(!isOpen)} className='team-item'>{team}</p>
      </Link>
    </div>;
  };

  const handleCreateTeam = () => {
    setIsOpen(!isOpen);
    setIsCreateTeamView(true);
    setIsCreateChatClicked(false);
    setIsDetailedChatClicked(false);
    if (!URL.includes('home-page')) {
      navigate('/');
    };
  };

  const handleGoToHomPage = () => {
    setIsDetailedChatClicked(false);
    setIsCreateTeamView(false);
    setIsCreateChatClicked(false);
    navigate('/');
  };

  return (
    <>
      <header id='header'>
        <div id='stats'>
          <h4 className='stats'>Total active users: {usersCount}</h4>
          <h4 className='stats'>Total active teams: {teamsCount}</h4>
        </div>

        <div id='navigation'>
          <button className='header-btn' onClick={handleGoToHomPage}>Home</button>
          <button className='header-btn' onClick={() => navigate('/about-us')}>About us</button>

          {user ?
            <>
              <button className='header-btn' onClick={toggling}>My teams</button>
              {isOpen &&
                <div id='dropdown-menu-myteams'>
                  {teams !== null ? Object.keys(teams).map((team) => mappingTeam(team, uid())) : <p>No teams to show</p>}
                  <button id='create-a-team-btn-header' onClick={handleCreateTeam}>Create a team</button>
                </div>

              }
              <Link to={'/my-meetings'}>
                <button className='header-btn' id='my-meetings'>My meetings</button>
              </Link>
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
