import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import FlagRenderer from './components/FlagRenderer.js';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [columnDefs] = useState([
    {
      headerName: 'Flag',
      field: 'flags.png',
      cellRenderer: FlagRenderer,
      minWidth: 80,  // Reduce the minimum width further
      maxWidth: 80,  // Ensure consistency
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Country Name',
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
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Country Explorer</h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '10px',
        }}
      >
        <input
          type="text"
          placeholder="Search by country name, language, or currency..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: '50%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={() => setShowFavoritesModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          View Favorites
        </button>
      </div>

      <div
        className="ag-theme-alpine"
        style={{
          height: '600px',
          width: '1000px',
          margin: 'auto',
          marginTop: '0px',
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
          onRowClicked={(event) => setSelectedCountry(event.data)}
        />
      </div>

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
          <h3>
            Country Details
            <button
              onClick={() => toggleFavorite(selectedCountry.name.common)}
              style={{
                marginLeft: '15px',
                padding: '8px 16px',
                backgroundColor: favorites.has(selectedCountry.name.common) ? '#ffc107' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {favorites.has(selectedCountry.name.common) ? 'Unmark Favorite' : 'Mark as Favorite'}
            </button>
          </h3>
          {renderCountryDetails(selectedCountry)}
        </div>
      )}

      {showFavoritesModal && (
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
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setShowFavoritesModal(false)}
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
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Favorite Countries</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {Array.from(favorites).map((favorite) => (
              <li
                key={favorite}
                style={{
                  background: '#f4f4f4',
                  marginBottom: '10px',
                  padding: '10px',
                  borderRadius: '5px',
                  textAlign: 'center',
                }}
              >
                {favorite}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(selectedCountry || showFavoritesModal) && (
        <div
          onClick={() => {
            setSelectedCountry(null);
            setShowFavoritesModal(false);
          }}
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
    </div>
  );
};

export default App;
