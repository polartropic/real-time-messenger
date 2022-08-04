import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './views/Homepage/HomePage';

function App() {
  return (
    <div className="App">
      <Header/>
      <HomePage/>
    </div>
  );
}

export default App;
