import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './Header.css';

const Header = (): JSX.Element => {
  return (
    <header id='header'>
      <div id='stats'>
        <h4 className='stats'>Total active users: 10</h4>
        <h4 className='stats'>Total active teams: 5</h4>
      </div>
      <div id='navigation'>
        <button className='header-btn'>About us</button>
        <button className='header-btn'>My teams</button>
        <img className="default-avatar" src={DefaultAvatar} alt="default-avatar" />
      </div>

    </header>
  );
};

export default Header;
