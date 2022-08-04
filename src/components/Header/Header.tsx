import { useContext } from 'react';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { logOut } from '../../services/auth.services';
import './Header.css';
import AppContext from '../../providers/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = (): JSX.Element => {
  const { appState, setState } = useContext(AppContext);
  const user = appState.user;
  const navigate = useNavigate();

  const handleLogOut = () => {
    setState({
      user: null,
      userData: null,
    });

    logOut();

    alert('Successful sign out!');
    navigate('/');
  };

  return (
    <header id='header'>
      <div id='stats'>
        <h4 className='stats'>Total active users: 10</h4>
        <h4 className='stats'>Total active teams: 5</h4>
      </div>

      <div id='navigation'>
        <button className='header-btn' onClick={() => navigate('/about-us')}>About us</button>

        {user ?
          <>
            <button className='header-btn'>My teams</button>
            <button onClick={handleLogOut} className='header-btn'>Log out</button>
            <img className="default-avatar" src={DefaultAvatar} alt="default-avatar" />
          </> :
          null
        }
      </div>
    </header>
  );
};

export default Header;
