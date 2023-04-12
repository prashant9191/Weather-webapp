const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const lodergif = document.getElementById("lodergif");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const city_name = document.getElementById("city_name");
const citybtn = document.getElementById("citybtn");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

document.body.style.backgroundImage = "url('morning_image.jpg')";
const time = new Date();

const hour = time.getHours();
if (hour >= 5 && hour < 10) {
  document.body.style.backgroundImage = `url('./morning_image.jpg')`;
} else if (hour >= 10 && hour < 12) {
  document.body.style.backgroundImage = `url('./afternoon_2.jpg')`;
} else if (hour >= 12 && hour < 17) {
  document.body.style.backgroundImage = `url('./afternoon_2.jpg')`;
} else if (hour >= 17 && hour < 19) {
  document.body.style.backgroundImage = `url('./evening_image.jpg')`;
} else {
  document.body.style.backgroundImage = `url('./night_image.jpg')`;
}



citybtn.addEventListener("click", function (e) {
  const cityName = city_name.value.trim();
 if(!cityName){
  swal({
    title: "Please Enter The City Name First",
    text: "In Order To Get The Weather Deatils.",
    icon: "success",
  });
 }else{
   getWeatherDatabycity(cityName);
   city_name.value = "";
 }
});

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    lodergif.style.display = "block";
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
        lodergif.style.display = "none";
      });
  });
}
function getWeatherDatabycity(city_Name) {
  lodergif.style.display = "block";
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city_Name}&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        if(data.cod==404){
          lodergif.style.display = "none";
          swal({
            title: `${data.message}`,
            text: "Enter Correct City Name",
            icon: "success",
          });
        }else{
          lodergif.style.display = "none";
          showWeatherData_by_city(data);
        }
    });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = `TimeZone : ${data.timezone}`;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `
  <div class="weather-item">
        <div>Current Temp:</div>
        <div>${
            data.current.feels_like
          }&#176;C</div>
    </div>
  <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div style="margin-right:4px">Sunrise :</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset :</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    
    
    `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <p class="current_day_p">Current Day</p>
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}

function kelvinToCelsius(temp) {
  let x = (temp - 273.15).toFixed(1);
  return x;
}

const weekdays_arr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let today_i = new Date().getDay();

function showWeatherData_by_city(data) {
  let { humidity, pressure } = data.list[0].main;
  let { sunrise, sunset } = data.city;
  let wind_speed = data.list[0].wind.speed;
  timezone.innerHTML = `${data.city.name}`;
  countryEl.innerHTML = data.city.coord.lat + "N " + data.city.coord.lon + "E";

  currentWeatherItemsEl.innerHTML = `
  <div class="weather-item">
        <div>Current Temp:</div>
        <div>${kelvinToCelsius(
            data.list[0].main.feels_like
          )}&#176;C</div>
    </div>
  <div class="weather-item">
        <div>Humidity:</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure:</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed:</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div style="margin-right:4px">Sunrise :</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset :</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    
    
    `;

  let otherDayForcast = "";
  for (let i = 0; i < 8; i++) {
    if (today_i > 6) {
      today_i = 0;
    }
    const dayName = new Date(data.list[i].dt_txt).toLocaleString("en-us", {
      weekday: "long",
    });
    if (i == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              data.list[0].weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <p class="current_day_p">Current Day</p>
                <div class="day">${weekdays_arr[today_i++]}</div>
                <div class="temp">Night - ${kelvinToCelsius(
                  data.list[0].main.temp_min
                )}&#176;C</div>
                <div class="temp">Day - ${kelvinToCelsius(
                  data.list[0].main.temp_max
                )}&#176;C</div>
            </div>
            
            `;
    } else {
      if (today_i > 6) {
        today_i = 0;
      }
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${weekdays_arr[today_i++]}</div>
                <img src="http://openweathermap.org/img/wn/${
                  data.list[i].weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${kelvinToCelsius(
                  data.list[i].main.temp_min
                )}&#176;C</div>
                <div class="temp">Day - ${kelvinToCelsius(
                  data.list[i].main.temp_max
                )}&#176;C</div>
            </div>
            
            `;
    }
  }

  weatherForecastEl.innerHTML = otherDayForcast;
}
