import './HomePage.css';
import { useContext } from 'react';
import AppContext from '../../providers/AppContext';
import LandingPage from '../LandingPage/LandingPage';
import Register from '../../components/Register/Register';

const HomePage = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const user = appState.user;

  return (
    <>
      {user ?
        <LandingPage /> :
        <Register />
      }
    </>
  );
};

export default HomePage;
