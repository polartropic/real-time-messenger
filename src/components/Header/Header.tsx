import React, { ReactNode, useContext, useEffect, useState } from 'react';
import ThunderTeamLogo from '../../assets/images/ThunderTeamLogo-noBackground.png';
import { logOut } from '../../services/auth.services';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';
import { getLiveTeamsByUsername, getLiveUserByUsername, updateUserStatus } from '../../services/users.services';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { uid } from 'uid';
import { Team, User } from '../../types/Interfaces';
import InitialsAvatar from 'react-initials-avatar';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import OutsideClickHandler from 'react-outside-click-handler';
import { UserStatus } from '../../common/user-status.enum';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';

const Header = (): JSX.Element => {
  const { appState,
    setState,
    setIsTeamView,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
  } = useContext(AppContext);
  const user = appState.user;
  const userUsername = appState.userData?.username;

  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userData, setUserData] = useState<User>({} as User);

  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<HTMLElement>();
  const [width, setWidth] = useState(0);
  const [isNavMenu, setIsNavMenu] = useState(true);

  useEffect(() => {
    const handleWidth = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWidth);

    return () => window.removeEventListener('resize', handleWidth);
  }, []);

  useEffect(() => {
    if (width < 1050) {
      setIsNavMenu(false);
    } else {
      setIsNavMenu(true);
    }
  }, [width]);
  useEffect(() => {
    if (appState.userData?.username) {
      const unsubscribe = getLiveUserByUsername(appState.userData.username,
        (snapshot) => {
          setUserData((snapshot.val()));
        });

      return () => unsubscribe();
    }
  }, [appState.userData?.username]);

  useEffect(() => {
    if (userUsername !== undefined) {
      const unsubscribe = getLiveTeamsByUsername(userUsername, (snapshot) => {
        setTeams(snapshot.val());
      });

      return () => unsubscribe();
    }
  }, [userUsername]);

  useEffect(() => {
    activeButton?.classList.add('active-header-button');
  }, [activeButton?.classList]);

  const handleLogOut = () => {
    setState({
      user: null,
      userData: null,
    });

    logOut().catch(console.error);
    updateUserStatus(userUsername!, UserStatus.OFFLINE).catch(console.error);

    toast.success('Successful sign out!');
    navigate('/');
  };

  const toggle = () => setIsTeamsOpen(!isTeamsOpen);

  const handleMyTeamsClick = (e: React.MouseEvent<HTMLElement>) => {
    toggle();
    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    setIsTeamsOpen(!isTeamsOpen);
  };

  const openATeam = () => {
    if (width < 1050) {
      setIsNavMenu(false);
    }

    toggle();
    setIsDetailedChatClicked(false);
    setIsCreateChatClicked(false);
  };

  const URL = window.location.href;

  const mappingTeam = (team: ReactNode, key: string | number) => {
    return <div key={key}>
      <Link to={`/teams/${team}`}>
        <p key={key} onClick={openATeam} className='team-item'>{team}</p>
      </Link>
    </div>;
  };

  const handleCreateTeam = (e: React.MouseEvent<HTMLElement>) => {
    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    toggle();
    setIsTeamView(true);
    setIsCreateChatClicked(false);
    setIsDetailedChatClicked(false);
    if (width < 1050) {
      setIsNavMenu(false);
    }


    if (!URL.includes('home-page')) {
      navigate('/');
    };
  };

  const handleGoToHomPage = (e: React.MouseEvent<HTMLElement>) => {
    if (width < 1050) {
      setIsNavMenu(false);
    }

    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    setIsDetailedChatClicked(false);
    setIsTeamView(false);
    setIsCreateChatClicked(false);
    navigate('/');
  };

  const handleAboutUs = (e: React.MouseEvent<HTMLElement>) => {
    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    if (width < 1050) {
      setIsNavMenu(false);
    }

    navigate('/about-us');
  };

  const handleMyMeetingsClick = (e: React.MouseEvent<HTMLElement>) => {
    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    if (width < 1050) {
      setIsNavMenu(false);
    }

    navigate('/my-meetings');
  };

  const handleStatusClick = (e: React.MouseEvent<HTMLElement>) => {
    activeButton?.classList.remove('active-header-button');
    setActiveButton(e.currentTarget);
    setIsStatusOpen(!isStatusOpen);
  };

  const handleBusy = () => {
    updateUserStatus(userUsername!, UserStatus.DO_NOT_DISTURB).catch(console.error);
  };

  const handleOnline = () => {
    updateUserStatus(userUsername!, UserStatus.ONLINE).catch(console.error);
  };

  return (
    <>
      <header id='header'>
        <div id='stats'>
          <img src={ThunderTeamLogo} alt='logo' className='main-logo'></img>
        </div>
        <div id={width > 1050 ? 'navigation' : 'navigation-menu'}>
          {isNavMenu &&
            <>
              <button className='header-btn' onClick={handleGoToHomPage}>Home</button>
              <button className='header-btn' onClick={handleAboutUs}>About us</button>

              {user ?
                <>
                  <button className='header-btn' onClick={handleMyTeamsClick}>My teams</button>
                  {isTeamsOpen &&

                    <div id='dropdown-menu-myteams'>
                      <OutsideClickHandler onOutsideClick={() => setIsTeamsOpen(false)}>

                        <button id='create-a-team-btn-header' onClick={handleCreateTeam}>Create a team</button>
                        <div id='mapping-teams'>
                          {teams !== null ? Object.keys(teams).map((team) => mappingTeam(team, uid())) : <p>No teams to show</p>}
                        </div>
                      </OutsideClickHandler>
                    </div>
                  }

                  <button className='header-btn' id='my-meetings' onClick={handleMyMeetingsClick}>My meetings</button>

                  <button onClick={handleLogOut} className='header-btn' id='logout-btn'>Log out</button>
                </> :
                null
              }
            </>}
        </div>

        {width < 1050 && user &&
          <button className='send-btn' value='' onClick={() => setIsNavMenu(!isNavMenu)}>
            <i className="fa-solid fa-bars  "></i>
          </button>}

        {user ?

          <div className='header-avatar'>
            <Link to={'/edit-profile'} style={{ textDecoration: 'none' }}>
              {userData.imgURL ?
                <img src={userData.imgURL} alt='avatar' className='user-avatar-header' /> :
                <InitialsAvatar name={`${userData.firstName} ${userData.lastName}`} className={'avatar-default-header'} />
              }
            </Link>
            <button className='set-status-btn' onClick={handleStatusClick}><UserStatusIndicator user={appState.userData!} /></button>
            {isStatusOpen &&
              <div className='dropdown-menu-status'>
                <OutsideClickHandler
                  onOutsideClick={() => setIsStatusOpen(false)}>
                  <button onClick={handleBusy}>Busy</button>
                  <button onClick={handleOnline}>Online</button>
                </OutsideClickHandler>
              </div>
            }

          </div> :
          null}
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;
