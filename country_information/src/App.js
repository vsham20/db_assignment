import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnDefs] = useState([
    {
      headerName: 'Flag',
      field: 'flag',
      cellRendererFramework: (params) => {
        return (
          <img
            src={params.value}
            alt="Flag"
          />
        );
      },
      width: 100,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Name',
      field: 'name.common',
      sortable: true,
      filter: true,
      cellStyle: {paddingLeft: '10px' },
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
      cellStyle: {paddingLeft: '10px' },
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
      cellStyle: {paddingLeft: '10px' },
    },
    {
      headerName: 'Population',
      field: 'population',
      sortable: true,
      filter: true,
      cellStyle: (params) => ({
        textAlign: 'right',
      }),
    },
  ]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        setRowData(data);
        setFilteredData(data); // Initialize filteredData with full data
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle search functionality
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

      return (
        countryName.includes(query) || languages.includes(query) || currencies.includes(query)
      );
    });

    setFilteredData(filtered);
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
          rowData={filteredData} // Use filtered data
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default App;
