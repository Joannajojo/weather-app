import React from 'react'
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Correct icon import


const SearchBar = ({city,setCity,handleSubmit}) => {
  return (
    <div id="search-bar">
      <div id="search-bar-box">
        <FontAwesomeIcon id="search-icon" icon={faSearch} />
        <input type="search"
   placeholder="Search here" value={city} onChange={(event) => setCity(event.target.value)} />
        <button type="submit" onClick={handleSubmit}> Search   </button>
      </div>
    </div>
  )
}

export default SearchBar
