import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [columnDefs] = useState([
    {
      headerName: 'Flag',
      field: 'flag',
      cellRendererFramework: (params) => (
        <img src={params.value} alt="Flag" style={{ width: '40px', height: '30px' }} />
      ),
      width: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Name',
      field: 'name.common',
      sortable: true,
      filter: true,
      cellStyle: { paddingLeft: '10px' },
    },
    {
      headerName: 'Currencies',
      valueGetter: (params) => {
        const currencies = params.data.currencies;
        if (currencies) {
          return Object.entries(currencies)
            .map(([code, details]) => `${details.name} (${details.symbol})`)
            .join(', ');
        }
        return 'No Currencies';
      },
      cellStyle: { paddingLeft: '10px' },
    },
    {
      headerName: 'Languages',
      valueGetter: (params) => {
        const languages = params.data.languages;
        if (languages) {
          return Object.values(languages).join(', ');
        }
        return 'No Languages';
      },
      cellStyle: { paddingLeft: '10px' },
    },
    {
      headerName: 'Population',
      field: 'population',
      sortable: true,
      filter: true,
      cellStyle: {
        textAlign: 'right',
      },
    },
  ]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((country) => ({
          ...country,
          flag: country.flags.png,
        }));
        setRowData(formattedData);
        setFilteredData(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = rowData.filter((country) => {
      const countryName = country.name.common.toLowerCase();
      const languages = country.languages ? Object.values(country.languages).join(', ').toLowerCase() : '';
      const currencies = country.currencies
        ? Object.entries(country.currencies)
            .map(([code, details]) => `${details.name} (${details.symbol})`)
            .join(', ')
            .toLowerCase()
        : '';

      return countryName.includes(query) || languages.includes(query) || currencies.includes(query);
    });

    setFilteredData(filtered);
  };

  const onRowClicked = (event) => {
    setSelectedCountry(event.data);
  };

  const closeModal = () => {
    setSelectedCountry(null);
  };

  const toggleFavorite = (countryName) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(countryName)) {
        newFavorites.delete(countryName);
      } else {
        newFavorites.add(countryName);
      }
      return newFavorites;
    });
  };

  const renderCountryDetails = (country) => {
    if (!country) return null;

    const isFavorite = favorites.has(country.name.common);

    return (
      <div style={{ lineHeight: '1.6' }}>
        <p><strong>Official Name:</strong> {country.name.official}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Subregion:</strong> {country.subregion}</p>
        <p><strong>Capital:</strong> {country.capital?.join(', ') || 'No Capital'}</p>
        <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Currencies:</strong> {Object.entries(country.currencies || {})
          .map(([code, details]) => `${details.name} (${details.symbol})`)
          .join(', ')}</p>
        <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
        <p><strong>Timezones:</strong> {country.timezones?.join(', ')}</p>
        <p><strong>Borders:</strong> {country.borders?.join(', ') || 'No Borders'}</p>
        <img src={country.flags.png} alt={`${country.name.common} Flag`} style={{ width: '100px', marginTop: '10px' }} />
        <button
          onClick={() => toggleFavorite(country.name.common)}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: isFavorite ? '#ffc107' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Country Explorer</h2>

      <input
        type="text"
        placeholder="Search by country name, language, or currency..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          width: '80%',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          display: 'block',
          margin: '0 auto',
        }}
      />

      <div
        className="ag-theme-alpine"
        style={{
          height: '600px',
          width: '1000px',
          margin: 'auto',
          marginTop: '20px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          onRowClicked={onRowClicked}
        />
      </div>

      {/* Modal for displaying selected country details */}
      {selectedCountry && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            width: '80%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
          <h3>Country Details</h3>
          {renderCountryDetails(selectedCountry)}
        </div>
      )}

      {/* Modal Background */}
      {selectedCountry && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Display Favorites */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Favorite Countries</h3>
        <ul>
          {Array.from(favorites).map((favorite) => (
            <li key={favorite}>{favorite}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
