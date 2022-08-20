import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AboutUs from './views/AboutUs/AboutUs';
import Header from './components/Header/Header';
import AppContext from './providers/AppContext';
import EditProfile from './views/EditProfile/EditProfile';
import HomePage from './views/Homepage/HomePage';
import Login from './views/Login/Login';
import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.services';
import Authenticated from './hoc/Authenticated';
import NotFound from './views/NotFound/NotFound';
import MyTeam from './views/Team/Team';
import { iAppState } from './types/Interfaces';
import Meetings from './views/Meetings/Meetings';
import DetailedMeeting from './views/DetailedMeeting/DetailedMeeting';

function App() {
  const [appState, setState] = useState<iAppState>({
    user: null,
    userData: null,
  });

  const [isCreateTeamView, setIsCreateTeamView] = useState(false);
  const [isDetailedChatClicked, setIsDetailedChatClicked] = useState(false);
  const [isCreateChatClicked, setIsCreateChatClicked] = useState(false);

  const [user]: AuthStateHook = useAuthState(auth);

  useEffect(() => {
    if (user === null || user === undefined) return;

    getUserData(user.uid)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setState({
          user,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch((e) => console.log(e));
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <AppContext.Provider value={{
          appState,
          setState,
          isCreateTeamView,
          setIsCreateTeamView,
          setIsCreateChatClicked,
          isCreateChatClicked,
          setIsDetailedChatClicked,
          isDetailedChatClicked,
        }}>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/home-page" />} />
            <Route path="home-page" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="edit-profile" element={<Authenticated><EditProfile /></Authenticated>} />
            <Route path="teams/:name" element={<Authenticated><MyTeam /></Authenticated>} />
            <Route path="my-meetings/:meetingID" element={<Authenticated><DetailedMeeting /></Authenticated>} />
            <Route path="my-meetings" element={<Authenticated><Meetings /></Authenticated>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
