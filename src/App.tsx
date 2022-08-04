import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AboutUs from './components/AboutUs/AboutUs';
import Header from './components/Header/Header';
import AppContext from './providers/AppContext';
import HomePage from './views/Homepage/HomePage';
import Login from './views/Login/Login';

function App() {
  const [appState, setState] = useState({
    user: null,
    userData: null,
  });

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
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
