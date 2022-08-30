import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import Gitlab from '../../assets/images/Gitlab-icon.png';
import Stefani from '../../assets/images/Stefani.jpg';
import './AboutUs.css';

const AboutUs = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='about-us'>
      <button onClick={() => navigate('/')} className='go-back-btn'>
        <img src='https://firebasestorage.googleapis.com/v0/b/thunderteam-99849.appspot.com/o/icons8-go-back-48.png.png?alt=media&token=8ce74f60-5dea-4e0f-9260-9102f6b30071' alt='go-back-icon' />
      </button>

      <h1>About the developers</h1>

      <div className='descriptions'>
        <div className='single'>
          <img className='avatar-about-us' src={DefaultAvatar} alt='Avatar of creator' />
          <h3>Emil Botev</h3>
          <a href="https://gitlab.com/emilebotev" target="_blank" rel="noreferrer noopener">
            <img className='gitlab-icon' src={Gitlab} alt="gitlab-icon" />
          </a>
        </div>

        <div className='single'>
          <img className='avatar-about-us' src={Stefani} alt='Avatar of creator' />
          <h3>Stefani Staneva</h3>
          <a href="https://gitlab.com/StefaniStaneva97" target="_blank" rel="noreferrer noopener">
            <img className='gitlab-icon' src={Gitlab} alt="gitlab-icon" />
          </a>
        </div>

        <div className='single'>
          <img className='avatar-about-us' src={DefaultAvatar} alt='Avatar of creator' />
          <h3>Teodora Yaneva</h3>
          <a href="https://gitlab.com/teodorayaneva" target="_blank" rel="noreferrer noopener">
            <img className='gitlab-icon' src={Gitlab} alt="gitlab-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
