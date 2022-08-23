import { ReactNode, useContext, useEffect, useState } from 'react';
import ThunderTeamLogo from '../../assets/images/ThunderTeamLogo-noBackground.png';
import { logOut } from '../../services/auth.services';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';
import { getLiveTeamsByUsername } from '../../services/users.services';
import { Link } from 'react-router-dom';
import './Header.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uid } from 'uid';
import { Team } from '../../types/Interfaces';
import InitialsAvatar from 'react-initials-avatar';

const Header = (): JSX.Element => {
  const { appState,
    setState,
    setIsCreateTeamView,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
  } = useContext(AppContext);
  const user = appState.user;
  const userUsername = appState.userData?.username;
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

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
          <img src={ThunderTeamLogo} alt='logo' className='main-logo'></img>
        </div>

        <div id='navigation'>
          <button className='header-btn' onClick={handleGoToHomPage}>Home</button>
          <button className='header-btn' onClick={() => navigate('/about-us')}>About us</button>

          {user ?
            <>
              <button className='header-btn' onClick={toggling}>My teams</button>
              {isOpen &&
                <div id='dropdown-menu-myteams'>
                  <button id='create-a-team-btn-header' onClick={handleCreateTeam}>Create a team</button>
                  <div id='mapping-teams'>
                    {teams !== null ? Object.keys(teams).map((team) => mappingTeam(team, uid())) : <p>No teams to show</p>}
                  </div>
                </div>

              }
              <Link to={'/my-meetings'} id='link-to-meetings'>
                <button className='header-btn' id='my-meetings'>My meetings</button>
              </Link>
              <button onClick={handleLogOut} className='header-btn'>Log out</button>
              <Link to={'/edit-profile'} style={{ textDecoration: 'none' }}>
                {appState.userData?.imgURL ?

                  <img src={appState.userData?.imgURL}
                    alt="avatar"
                    className='user-avatar-header' /> :

                  <InitialsAvatar
                    name={`${appState.userData?.firstName} ${appState.userData?.lastName}`}
                    className={'avatar-default-header'} />

                }

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
