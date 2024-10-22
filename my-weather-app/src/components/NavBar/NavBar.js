import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSunRain } from "@fortawesome/free-solid-svg-icons"; // Correct icon import
const NavBar = () => {
  const [emptyStr, setEmptyStr] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  let text = "Weather App";
  let speed = 200;

  //Typing animation on nav bar
  useEffect(() => {
    if (currentIndex < text.length) {
      const typingAnimation = setTimeout(() => {
        setEmptyStr((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearInterval(typingAnimation);
    }
  }, [currentIndex, speed, text]);

  return (
    <div id="nav-bar">
      <h1>
        <FontAwesomeIcon icon={faCloudSunRain} /> {emptyStr}
      </h1>
    </div>
  );
};

export default NavBar;
