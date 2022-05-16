import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {    
    const inputCountry = event.target.value.trim();  
    if (inputCountry === '') { return } ;
    outputClear();
    API.fetchCountries(inputCountry)
        .then(renderHTML)
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
          });
};

function outputClear() {
    refs.info.innerHTML = '';
    refs.list.innerHTML = '';
};

function renderHTML(country) {
    if (country.length > 10) {
               Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
           } else if (country.length >= 2 && country.length <= 10){
               renderCountryList(country);
           } else if (country.length === 1){
               renderCountryCard(country);
           } 
};

function renderCountryList(countriesArr) {
    const markup = countriesArr.map(({ flags, name }) => {
        return `<li class="country_item">
        <p><img src="${flags.svg}" width="50px"/>
        ${name.official}</p>
        </li>`;
    }).join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
};

function renderCountryCard(country) {
    const markup = country.map(({ flags, name, capital, population, languages }) => {
        return `<div class="country-card">
        <h1><img src="${flags.svg}" width="50px"/>
        ${name.official}
        </h1>        
        <p><span>Capital:</span> ${capital}</p>
        <p><span>Population:</span> ${population}</p>
        <p><span>Languages:</span> ${Object.values(languages).join(', ')}</p>
        </div>`;
    }).join('');
    refs.info.insertAdjacentHTML('beforeend', markup);
};
