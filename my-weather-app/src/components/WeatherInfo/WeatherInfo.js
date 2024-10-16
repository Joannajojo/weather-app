import React , { useEffect,  useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import './WeatherInfo.css'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCloud, faCloudRain, faCloudSunRain } from '@fortawesome/free-solid-svg-icons'; // Correct icon import
import rainIcon from '../../assets/rain.png';

const WeatherInfo = () => {
  const [city,setCity] = useState("Japan");
  const [time,setTime] = useState("");
  const [date,setDate] = useState("");
  const [day,setDay] = useState("");

  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastWeatherData, setForecastWeatherData] = useState(null);
  const [forecastArray, setForecastArray] =useState([]);

  const [tempDisplay,setTempDisplay] = useState("");
  const [minTempDisplay,setMinTempDisplay] = useState("");
  const [maxTempDisplay,setMaxTempDisplay] = useState("");
  const [humidityDisplay,setHumidityDisplay] = useState("");
  const [weatherDescDisplay,setWeatherDescDisplay] = useState("");
  const displayWeatherInfo = (value) => {
    setTempDisplay(value.main.temp);
    setMinTempDisplay(value.main.temp_min);
    setMaxTempDisplay(value.main.temp_max);
    setHumidityDisplay(value.main.humidity);
    setWeatherDescDisplay(value.weather[0].description);
    setDay(getDay(new Date(value.dt_txt.slice(0,10)).getDay()));
    setTime(formatDateTime(value.dt_txt).newTime);
  }
  const formatDateTime = (dateTime) => {
    if (!dateTime) return { newDate: "", newTime: "" }; // safeguard if dateTime is undefined

    let day=dateTime.slice(8,10);
    let month=dateTime.slice(5,7);
    let year=dateTime.slice(0,4);
    let newDate=`${day}/${month}/${year}`;

    let hour=dateTime.slice(11,13);
    let min=dateTime.slice(14,16);
    let newTime=`${hour}.${min}`;

    return {newDate,newTime};
  }


//get list of forecast weathers of the next 5 days using forecastWeatherData
  const getForecastWeather = (startDate) => {
    if (!forecastWeatherData || !forecastWeatherData.list || forecastWeatherData.list.length === 0) {
      console.log("Forecast weather data is not available yet.");
      return; // Exit if data is not available
    }
    let i = 0;
    let index=startDate;
    let forecastDays =[]; //contain objects of the same date
    let forecastDates=[]; //contain all objects
    const dataLength = forecastWeatherData.list.length;
    
    if(dataLength){
      while(i<dataLength)
        {
          
          let date = formatDateTime(forecastWeatherData.list[i].dt_txt).newDate;
          
          if(index !== date){
            forecastDates.push(forecastDays);
            index=date;
            forecastDays =[];
          }

          forecastDays.push(forecastWeatherData.list[i]);

          // //if reach the last object in the array, ensure forecastDays is added to the main array
          if(i===(dataLength)-1){ //last index
             forecastDates.push(forecastDays);
           }
        i++;
      }
    }
    else{
      console.log('data is null');
    }
    //console.log(forecastWeatherData);
    setForecastArray(forecastDates);
  }
  //retrieve current time in the searched city using World Time API
  const getTodayTime = async() => {
    try
    {
      const response = await axios.get(`http://worldtimeapi.org/api/timezone/${city}`);
      let dateObj = response.data;
      let dateTime = dateObj.datetime;
      const date = dateTime.toString().slice(0, 10);
		  const time = dateTime.toString().slice(11, 16);
      let dayOfWeek = dateObj.day_of_week;
      setDay(getDay(dayOfWeek));
      setDate(date);
      setTime(time);
    }
    
    catch(err) {
        console.log(err);
         
    };
  }

  //Return name of day
  const getDay= (value) => {
      let day="";
      switch(value)
      {
        case 0:
          day="Sun";
          break;
        case 1:
            day="Mon";
            break;
        case 2:
          day="Tue";
          break;
        case 3:
          day="Wed";
          break;
        case 4:
            day="Thu";
            break;
        case 5:
          day="Fri";
          break;
        case 6:
          day="Sat";
          break;
        default:
          day="Unknown"
          return;
      }
      return day;
  };
  //call API from (CurrentWeatherAPI) for today weather and (5 days Forecast API) for the forecast
  const fetchWeatherData = async () => {
    try{
      getTodayTime();      
      const [currentWeather, forecastWeather] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`)
      ]);
      
      // Set state only if both requests succeed
        if (currentWeather && forecastWeather) {
          setCurrentWeatherData(currentWeather.data);
          setForecastWeatherData(forecastWeather.data);
        }
    }catch(error){
      console.log("Error fetching weather data: ", error);
    }
  };
  
  //return the image src based on weather description
  const generateWeatherLogo = (desc) => {
    let logo="";
    switch(desc){
      case "clear sky":
        logo="01d";
        break;
      case "few clouds":
        logo="02d";
        break;
      case "scattered clouds":
        logo="03d";
        break;
      case "broken clouds":
      case "overcast clouds":
        logo="04d";
        break;
      case "shower rain":
        logo="09d";
        break;
      case "moderate rain":
      case "light rain":
      case "rain":
          logo="10d";
          break;
      case "thunderstorm":
        logo="11d";
        break;
      case "snow":
        logo="13d";
        break;
      case "mist":
        logo="50d";
        break; 
      default:
        return "";
    }
    let imgLink = `https://openweathermap.org/img/wn/${logo}.png`;
    return imgLink;
  };

  //Automatically fetches the current and forecast weather upon refresh page
  useEffect(()=>{
    fetchWeatherData();  
  } ,[]);

  //Update the forecast at the same time the forecastWeatherData is updated
  useEffect(()=>{
    const startDate = formatDateTime(date).newDate;
    getForecastWeather(startDate);
  },[forecastWeatherData]);

  //Update the weather info display if currentWeatherData is updated
  useEffect(()=>{
    if (currentWeatherData) {
      setTempDisplay(currentWeatherData.main?.temp || "");
      setMinTempDisplay(currentWeatherData.main?.temp_min || "");
      setMaxTempDisplay(currentWeatherData.main?.temp_max || "");
      setHumidityDisplay(currentWeatherData.main?.humidity || "");
      setWeatherDescDisplay(currentWeatherData?.weather[0].description|| "");
    }
  },[currentWeatherData]);

  //handle event when Search button is clicked
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent page reload on form submit
    fetchWeatherData();  
  };

  return (
    <div id="weather-info">
      <SearchBar city={city} setCity={setCity} handleSubmit={handleSubmit} />
      
      
      {/* Conditionally render weather data */}
      {currentWeatherData && forecastWeatherData && (
        <>
          <div id="current-weather">
            <div id="current-weather-left">
                <div id="current-weather-logo">
                <img src={generateWeatherLogo(weatherDescDisplay)}/>
                <p>{tempDisplay}°K</p>
              </div>
              <div id="current-weather-info">
                <ul>
                  <li>Humidity: {humidityDisplay}%</li>
                  <li>Min temp: {minTempDisplay}°K</li>
                  <li>Max temp: {maxTempDisplay}°K</li>
                </ul>
              </div>
            </div>
            <div id="current-weather-datetime">
              <p><strong>{currentWeatherData.name}</strong></p>
              <p>{day}, {time}</p>
              <p>{weatherDescDisplay}</p>
            </div>
          </div>
          <div id="forecast-weather">
            {forecastWeatherData && forecastArray ? 
            (
              forecastArray.map
              (
                  (row, rowIndex) => (
                    <div key={rowIndex}>
                    {  row.length >= 2 && row[2]?.dt_txt ? (
                        <button onClick={ () => displayWeatherInfo(row[2])}>
                        {formatDateTime(row[2]?.dt_txt || "").newDate}<br />
                        <img src={generateWeatherLogo(row[2].weather[0].description)}/><br />
                        { row[2]?.main.temp  || ""}° 
                        </button>
                      ) : row[0]?.dt_txt ?(
                        <button onClick={ () => displayWeatherInfo(row[0])}>
                          {formatDateTime(row[0]?.dt_txt || "").newDate} <br />
                          <img src={generateWeatherLogo(row[0].weather[0].description)}></img><br />
                          { row[0]?.main.temp  || ""}° 
                        </button>
                      ):null }
                    </div>
                  ))
            ):(
              <div>Loading forecast data...</div>  
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default WeatherInfo
