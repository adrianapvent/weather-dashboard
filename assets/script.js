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

