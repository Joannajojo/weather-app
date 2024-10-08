import React from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons'; // Correct icon import
const NavBar = () => {
  return (
    <div id="nav-bar">
      <h1><FontAwesomeIcon icon={ faCloudSunRain } /> Weather App</h1>
    </div>
  )
}

export default NavBar
