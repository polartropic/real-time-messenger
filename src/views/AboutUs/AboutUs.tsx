import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './AboutUs.css';

const AboutUs = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='about-us'>
      <button onClick={() => navigate('/')} className='go-back-btn'>
        <img src='https://firebasestorage.googleapis.com/v0/b/thunderteam-99849.appspot.com/o/icons8-go-back-48.png?alt=media&token=7bdfef4c-cf94-4147-8f4d-fc55fd086b4a' alt='go-back-icon' />
      </button>

      <h1>About the developers</h1>

      <div className='descriptions'>
        <div className='single'>
          <img src={DefaultAvatar} alt='Avatar of creator' />
          <h4>Emil Botev</h4>
          <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        </div>

        <div className='single'>
          <img src={DefaultAvatar} alt='Avatar of creator' />
          <h4>Stefani Staneva</h4>
          <p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
            magni dolores eos qui ratione voluptatem sequi nesciunt.
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."</p>
        </div>

        <div className='single'>
          <img src={DefaultAvatar} alt='Avatar of creator' />
          <h4>Teodora Yaneva</h4>
          <p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
            deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
            similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
            omnis voluptas assumenda est, omnis dolor repellendus."</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
