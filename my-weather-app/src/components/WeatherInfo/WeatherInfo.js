import React , { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import './WeatherInfo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faCloudRain, faCloudSunRain } from '@fortawesome/free-solid-svg-icons'; // Correct icon import
import rainIcon from '../../assets/rain.png';
const WeatherInfo = () => {
  const [city,setCity] = useState("");
  const [time,setTime] = useState("");
  const [day,setDay] = useState("");
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastWeatherData, setForecastWeatherData] = useState(null);

  //retrieve current time in the searched city
  const getTime = async() => {
    try
    {
      const response = await axios.get(`http://worldtimeapi.org/api/timezone/${city}`);
        
      let dateObj = response.data;
      let dateTime = dateObj.datetime;
      const date = dateTime.toString().slice(0, 10);
		  const time = dateTime.toString().slice(11, 16);
      let dayOfWeek = dateObj.day_of_week;
      let day="";
      switch(dayOfWeek){
        case 0:
          day="Mon";
          break;
        case 1:
            day="Tue";
            break;
        case 2:
          day="Wed";
          break;
        case 3:
          day="Thu";
          break;
        case 4:
            day="Fri";
            break;
        case 5:
          day="Sat";
          break;
        case 6:
          day="Sun";
          break;
        default:
          day="Unknown"
          return;
    }
    setDay(day);
    
    console.log(dateObj);
    console.log(dateTime);
    setTime(time);
    

    }
    
    catch(err) {
        console.log(err);
        
    };
  }
  const fetchWeatherData = async () => {
    try{
      getTime();
      const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`);
      const forecastWeather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`);


      setCurrentWeatherData(currentWeather.data);
      setForecastWeatherData(forecastWeather.data);
      
    }catch(error){
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent page reload on form submit
    fetchWeatherData();
    console.log('Submitted');
  };
  return (
    <div id="weather-info">
      <SearchBar city={city} setCity={setCity} handleSubmit={handleSubmit} />
      
      
      {/* Conditionally render weather data */}
      {currentWeatherData && forecastWeatherData && (
        <>
          <div id="current-weather">
            <div id="current-weather-logo">
              <p>{currentWeatherData && currentWeatherData.weather[0].main === "Rain" ? (
                <img src={rainIcon}/>
              ) : null} </p>
              <p>{currentWeatherData.main.temp}°K</p>
            </div>
            <div id="current-weather-info">
              <ul>
                <li>Pressure: {currentWeatherData.main.pressure}Pa</li>
                <li>Humidity: {currentWeatherData.main.humidity}%</li>
                <li>Min temp: {currentWeatherData.main.temp_min}°K</li>
                <li>Max temp: {currentWeatherData.main.temp_max}°K</li>
                <li>Feels Like: {currentWeatherData.main.feels_like}°K</li>
              </ul>
            </div>
            <div id="current-weather-datetime">
              <p>{currentWeatherData.name}</p>
              <p>{day}, {time}</p>
              <p>Weather: {currentWeatherData.weather[0].description}</p>
            </div>
            
            
            
          </div>
          
          <div id="forecast-weather">
            <button>
              {forecastWeatherData.list[0].dt_txt}

              <div>
                {currentWeatherData && currentWeatherData.weather[0].main === "Rain" ? (
                  <img src={rainIcon}/>
                ) : null} 
              </div>

              <div>
                <span>{Math.floor(forecastWeatherData.list[0].main.temp_min)}°</span>
                <span>{Math.floor(forecastWeatherData.list[0].main.temp_max)}°</span>
              </div>
            </button>
          <h2>Forecast Weather</h2>
          
          <p>Weather: {forecastWeatherData.list[0].weather[0].description}</p>
          <p>Temperature: {forecastWeatherData.list[0].main.temp}°K</p>
          
          </div>
          
        </>
      )}

    </div>
  )
}

export default WeatherInfo
