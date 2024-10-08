import './App.css';
import NavBar from './components/NavBar/NavBar';
import WeatherInfo from './components/WeatherInfo/WeatherInfo';
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon



function App() {
  return (
    <div className="App">
      <NavBar />
      <WeatherInfo />
    </div>
  );
}

export default App;
