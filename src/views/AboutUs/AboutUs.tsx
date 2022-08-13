import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './AboutUs.css';

const AboutUs = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="about-us">
      <button onClick={() => navigate('/')} className='go-back-btn'>
        <img src="https://firebasestorage.googleapis.com/v0/b/thunderteam-99849.appspot.com/o/icons8-go-back-48.png?alt=media&token=7bdfef4c-cf94-4147-8f4d-fc55fd086b4a" alt='go-back-icon' />
      </button>

      <h1>About the developers</h1>

      <img src={DefaultAvatar} alt="Avatar of creator" />
      <h4>Emil Botev</h4>

      <img src={DefaultAvatar} alt="Avatar of creator" />
      <h4>Stefani Staneva</h4>

      <img src={DefaultAvatar} alt="Avatar of creator" />
      <h4>Teodora Yaneva</h4>
    </div>
  );
};

export default AboutUs;
