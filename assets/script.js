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

