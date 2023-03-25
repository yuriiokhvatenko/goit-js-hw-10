import './css/styles.css';
import Notiflix from 'notiflix';
import backend from './fetchCountries';
import { debounce } from 'debounce';

const DEBOUNCE_DELAY = 300;

// refs
const refs = {
    form: document.querySelector(`#search-box`),
    list: document.querySelector(`.country-list`),
    divInfoCountry: document.querySelector(`.country-info`),
}

refs.form.addEventListener(`input`, debounce(countrySearch,DEBOUNCE_DELAY))

// ПОШУК КРАЇНИ 
function countrySearch(evt) {
    const formSearch = evt.target.value.trim();
    console.log(formSearch);

  if(formSearch) {
    backend.fetchCountries(formSearch)
      .then(successHandler)
      .catch(errorHandler)
  }

  clearInput(formSearch)
}

// Якщо одна країна
function renderSingleCountry(result) {
  if(result.length === 1) {
    refs.list.innerHTML = renderCountryList(result)
    refs.divInfoCountry.innerHTML = renderCountryInfo(result)
  }
}

// Якщо країн від 2 до 10
function renderSeveralCountries(result) {
  if(result.length >= 2 && result.length <= 10) {
    refs.divInfoCountry.innerHTML = ''
    refs.list.innerHTML = renderCountryList(result)
  }
}

// Якщо більше 10 країн
function multipleResults(result) {
  if(result.length > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
  }
}

// Помилка
function errorHandler() {
  Notiflix.Notify.failure("Oops, there is no country with that name")
}

// Очистка списку і блоку якщо форма пуста
function clearInput(formSearch) {
  if(formSearch === ''){
    refs.list.innerHTML = ''
    refs.divInfoCountry.innerHTML = ''
  }
}

// Рендер списку
function renderCountryList(evt) {
    return evt.map(el => {
      return `
        <li class="country-item">
          <img src="${el.flags.svg}" width="30" height="20">
          <b class="country-name">${el.name.official}</b>
        </li>`
    }).join('')
}

// Рендер інфо
function renderCountryInfo(evt) {
    return evt.map(el => {
      const language = Object.values(el.languages).join(', ')
      return `
        <ul class="div-info-list">
          <li><p class="div-info-text">Capital: <span class="div-info-span">${el.capital}</span></p></li>
          <li><p class="div-info-text">Population: <span class="div-info-span">${el.population}</span></p></li>
          <li><p class="div-info-text">Languages: <span class="div-info-span">${language}</span></p></li>
        </ul>`
    }).join('')
}


// Обробник
function successHandler(result) {
  renderSingleCountry(result)
  renderSeveralCountries(result)
  multipleResults(result)
}