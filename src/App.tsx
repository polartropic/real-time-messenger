import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AboutUs from './components/AboutUs/AboutUs';
import Header from './components/Header/Header';
import AppContext from './providers/AppContext';
import EditProfile from './views/EditProfile/EditProfile';
import HomePage from './views/Homepage/HomePage';
import Login from './views/Login/Login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.services';
import CreateTeam from './views/Create-a-team/CreateTeam';
import Authenticated from './hoc/Authenticated';
import NotFound from './views/NotFound/NotFound';

function App() {
  const [appState, setState] = useState({
    user: null,
    userData: null,
  });

  const [user]: any = useAuthState(auth);

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
        <AppContext.Provider value={{ appState, setState }}>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/home-page" />} />
            <Route path="home-page" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="edit-profile" element={<Authenticated><EditProfile /></Authenticated>} />
            <Route path="create-team" element={<Authenticated><CreateTeam /></Authenticated>} />
            {/* <Route path="teams/: team.name" element={<Authenticated><CreateTeam /></Authenticated>} /> */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
