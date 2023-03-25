export default { fetchCountries }

const URL = `https://restcountries.com/v3.1/name`;
const FILTER = `name,capital,population,flags,languages`;

function fetchCountries(country) {

  return fetch(`${URL}/${country}?fields=${FILTER}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

