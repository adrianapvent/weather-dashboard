tailwind.config = {
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        }
    }
}
const citySearchEl = document.querySelector('#form-search');
const citySearchInputEl = document.querySelector('#city-search');
const searchTermEl = document.querySelector('#searchTerm'); // implement it
const noResultsEl = document.querySelector('#no-results'); // implement it
const parentContainerEl = document.querySelector('#parent-container');

// render data;
const renderCityEl = document.querySelector('#curr-city');
const renderTempEl = document.querySelector('#curr-temp');
const renderWindEl = document.querySelector('#curr-wind');
const renderHumidityEl = document.querySelector('#curr-humidity');
const renderUvIndexEl = document.querySelector('#curr-uvindex');
const renderCurrDateEl = document.querySelector('#curr-date');

// searchHistoryList
const searchHistoryListEl = document.querySelector('#searchHistoryContainer');

let searchHistoryList = [];

// ************************************************************************
// Function(s)
// ************************************************************************
const searchSubmitHandler = function (event) {
    event.preventDefault(); // prevents page from refreshing

    // get value of form input
    const userInput = citySearchInputEl
        .value
        .trim();
    
    // send value to fetchCityName
    if (userInput === '' || userInput === null) {
        citySearchInputEl.classList.add("bg-red-300");
    }
    else if (userInput) {
        citySearchInputEl.classList.remove("bg-red-300");
        const modifiedCityName = userInput.toLowerCase();
        
        searchHistoryList.push(modifiedCityName);
        fetchCityName(modifiedCityName);
        saveSearchHistory();
        renderSearchHistory();
        citySearchInputEl.value = ''; // clear out element's value
    }
};
const saveSearchHistory = function () {
    localStorage.setItem('History', JSON.stringify(searchHistoryList));
};

const fetchCityName = function (cityName) {
    const directGeocodingApi = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    
    fetch(directGeocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                const {lat, lon, name} = data[0];
                fetchSelectedCityData(lat, lon, name);
            });
        }
        else {
            alert('Error: The city you entered was not found!');
        }
    })
    .catch(function(error) {
        // Notice that 'catch()' is chained onto the end of the previous '.then()' function
        alert('Unable to connect to Direct Geocoding Api!');
    });
};
const fetchSelectedCityData = function (lat, lon, cityName) { // receive latitutde & longitude from selected city
    // format open weather api endpoint
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);

    // fetch open weather api
    fetch(openWeatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                renderWeather(data, cityName);
            });
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeatherApi!');
    });
};

const renderSearchHistory = function () {
    let renderHistoryList = localStorage.getItem('History');
    
    // if no history, set array empty
    if (!renderHistoryList) {
        return false;
    }

    // parse into array of objects
    renderHistoryList = JSON.parse(renderHistoryList);

    // clear old content
    searchHistoryListEl.textContent = '';

    // loop through History array
    for (var i = 0; i < renderHistoryList.length; i++) {
        // create list item
        let listItem = document.createElement('li');
        listItem.classList = 'font-bold text-center text-slate-100 text-xl bg-slate-900 mb-2 py-1 px-3 rounded hover:bg-slate-400';
        listItem.textContent = `${renderHistoryList[i]}`;

        // append
        searchHistoryListEl.appendChild(listItem);
    }
};

const renderWeather = function (fetchData, cityName) {
/*     // clear old content
    parentContainerEl.textContent = ''; */
    
    const {temp, wind_speed, humidity, uvi, dt} = fetchData.current;
    const {daily} = fetchData;

    if (uvi <= 2) {
        renderUvIndexEl.classList = 'bg-green-500 px-2 py-1 rounded';
    }
    else if (uvi >= 3 && uvi <= 5) {
        renderUvIndexEl.classList = 'bg-yellow-500 px-2 py-1 rounded';
    }
    else if (uvi >= 6 && uvi <= 7) {
        renderUvIndexEl.classList = 'bg-orange-500 px-2 py-1 rounded';
    }
    else if (uvi >= 8 && uvi <= 10) {
        renderUvIndexEl.classList = 'bg-red-500 px-2 py-1 rounded';
    }
    else if (uvi >= 11) {
        renderUvIndexEl.classList = 'bg-purple-500 px-2 py-1 rounded';
    }

    // current weather
    renderCityEl.textContent = cityName;
    renderTempEl.innerHTML = `${temp}&#176;F`;
    renderWindEl.textContent = `${wind_speed} mph`;
    renderHumidityEl.textContent = `${humidity}%`;
    renderUvIndexEl.textContent = `${uvi} UV Index`;
    
    let dateEl = new Date(`${dt}` * 1000);
    renderCurrDateEl.textContent = dateEl.toDateString();

    // render container for 5-Day Weather Forecast
    let itfContainerEl = document.createElement('div'); // itf = in the future
    itfContainerEl.classList = 'flex flex-col items-left mx-5 p-5 border-2 rounded text-slate-100 font-bold';
    itfContainerEl.setAttribute('id', 'container-fivedays');

    // append child container // container-fivedays to parent-container
    parentContainerEl.appendChild(itfContainerEl);

    // future 5-day forecast  
    for (let i = 1; i <= 5; i++) {
        // create sections
        let dailyWeatherEl = document.createElement('section');
        dailyWeatherEl.classList = 'flex border-b-2 border-indigo-400 p-1 m-2';
        dailyWeatherEl.setAttribute('id', `subcontainer-fivedays-${i}`);

        // append sections container first...
        itfContainerEl.appendChild(dailyWeatherEl);

        // create date header
        let dateOfWeekEl = document.createElement('h2');
        dateOfWeekEl.classList = 'w-1/5';
        dateOfWeekEl.setAttribute('id', 'date');

        // add date
        let dateEl = new Date(`${daily[i].dt}` * 1000);
        dateOfWeekEl.textContent = dateEl.toDateString();
        
        // append date child to subcontainer
        dailyWeatherEl.appendChild(dateOfWeekEl);

        // create img
        let weatherIconEl = document.createElement('span');
        weatherIconEl.classList = 'justify-center w-1/5';
        
        // if weather is clear sky(☀), few clouds (⛅), scattered clouds (☁), broken clouds (), shower rain (🌧), rain (🌦), thunderstorm (⛈), snow (❄), mist (🌫)...
        let weatherCondition = daily[i].weather[0].main;

        switch (weatherCondition) {
            case 'Clear':
                weatherIconEl.textContent = '☀';
                break;
            case 'Clouds':
                weatherIconEl.textContent = '⛅';
                break;
            case 'Mist':
                weatherIconEl.textContent = '🌫';
                break;
            case 'Snow':
                weatherIconEl.textContent = '❄';
                break;
            case 'Rain':
                weatherIconEl.textContent = '🌧';
                break;
            case 'Drizzle':
                weatherIconEl.textContent = '🌦';
                break;
            case 'Thunderstorm':
                weatherIconEl.textContent = '⛈';
                break;
            default:
                weatherIconEl.textContent = '⁉';
        }

        // append to section subcontainer
        dailyWeatherEl.appendChild(weatherIconEl);

        // create unordered list
        let dailyForecastEl = document.createElement('ul');
        dailyForecastEl.classList = 'flex justify-center gap-5 w-3/5';
        dailyForecastEl.setAttribute('id', `daily-forecast`);

        // append unordered list
        dailyWeatherEl.appendChild(dailyForecastEl);

        // create list item // temperature
        let currentTempEl = document.createElement('li');
        currentTempEl.classList = 'w-1/3';
        currentTempEl.setAttribute('id', `curr-temp-${i}`);
        currentTempEl.innerHTML = `${daily[i].temp.day}&#176;F`;

        // append list item // temperature to unordered list
        dailyForecastEl.appendChild(currentTempEl);

        // create list item // wind_speed
        let currentWindEl = document.createElement('li');
        currentWindEl.classList = 'w-1/3';
        currentWindEl.setAttribute('id', `curr-wind-${i}`);
        currentWindEl.textContent = `${daily[i].wind_speed} mph`;

        // append list item // wind_speed to unordered list
        dailyForecastEl.appendChild(currentWindEl);
        
        // create list item // humidity
        let currentHumidityEl = document.createElement('li');
        currentHumidityEl.classList = 'w-1/3';
        currentHumidityEl.setAttribute('id', `curr-humidity-${i}`);
        currentHumidityEl.textContent = `${daily[i].humidity}%`;

        // append list item // humidity to unordered list
        dailyForecastEl.appendChild(currentHumidityEl);
    }
};

// ************************************************************************
// Event Listener(s)
// ************************************************************************
citySearchEl.addEventListener("submit", searchSubmitHandler);