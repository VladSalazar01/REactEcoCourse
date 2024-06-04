import React, { useState, useEffect } from 'react';

const CountryFilter = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data));
  }, []);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Country Filter</h2>
      <div>
        filter shown with: <input value={searchTerm} onChange={handleSearchTerm} />
      </div>
      <ul>
        {filteredCountries.map(country => (
          <li key={country.cca3}>
            {country.name.common} - Population: {country.population}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryFilter;
