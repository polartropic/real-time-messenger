import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './views/Homepage/HomePage';
import Login from './views/Login/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Navigate to="/home-page" />} />
          <Route path="home-page" element={<HomePage/>} />
          <Route path="login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
