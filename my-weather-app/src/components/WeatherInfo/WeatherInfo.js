import React , { useEffect,  useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import './WeatherInfo.css'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCloud, faCloudRain, faCloudSunRain } from '@fortawesome/free-solid-svg-icons'; // Correct icon import
import rainIcon from '../../assets/rain.png';

const WeatherInfo = () => {
  const [city,setCity] = useState("Penang");
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
  const displayWeatherInfo = (value) => {
    setTempDisplay(value.main.temp);
    setMinTempDisplay(value.main.temp_min);
    setMaxTempDisplay(value.main.temp_max);
    setHumidityDisplay(value.main.humidity);
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
          //console.log(`Date ${i} : ${date}`);
          //console.log(`Index ${i} : ${index}`);
          //console.log(date);
          
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
      switch(dayOfWeek)
      {
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
      setDate(date);
      setDay(day);
      setTime(time);
    }
    
    catch(err) {
        console.log(err);
         
    };
  }
  const fetchWeatherData = async () => {
    try{
      getTime();      
      const [currentWeather, forecastWeather] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`)
      ]);


      // Set state only if both requests succeed
        if (currentWeather && forecastWeather) {
          setCurrentWeatherData(currentWeather.data);
          setForecastWeatherData(forecastWeather.data);
        }
      
      const startDate = formatDateTime(date).newDate;
      getForecastWeather(startDate);
      
    }catch(error){
      console.log("Error fetching weather data: ", error);
    }

    
  };
  
  useEffect(()=>{
    fetchWeatherData();
  } ,[]);

  useEffect(()=>{
    if (currentWeatherData) {
      setTempDisplay(currentWeatherData.main?.temp || "");
      setMinTempDisplay(currentWeatherData.main?.temp_min || "");
      setMaxTempDisplay(currentWeatherData.main?.temp_max || "");
      setHumidityDisplay(currentWeatherData.main?.humidity || "");
    }
  },[currentWeatherData]);

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
            <div id="current-weather-logo">
               
              <p>{tempDisplay}°K</p>
            </div>
            <div id="current-weather-info">
              <ul>
                <li>Humidity: {humidityDisplay}%</li>
                <li>Min temp: {minTempDisplay}°K</li>
                <li>Max temp: {maxTempDisplay}°K</li>
              </ul>
            </div>
            <div id="current-weather-datetime">
              <p>{currentWeatherData.name}</p>
              <p>{day}, {time}</p>
              <p>Weather: {currentWeatherData.weather[0].description}</p>
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
                        {formatDateTime(row[2]?.dt_txt || "").newTime}
                        </button>
                      ) : row[0]?.dt_txt ?(
                        <button onClick={ () => displayWeatherInfo(row[0])}>
                          {formatDateTime(row[0]?.dt_txt || "").newDate} <br />
                          {formatDateTime(row[0]?.dt_txt || "").newTime}
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
