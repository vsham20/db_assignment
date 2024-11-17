import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [rowData, setRowData] = useState([]);
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
      headerName: 'Common Name',
      field: 'name.common',
      sortable: true,
      filter: true,
      cellStyle: { fontWeight: 'bold', paddingLeft: '10px' },
    },
    {
      headerName: 'Official Name',
      field: 'name.official',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { fontStyle: 'italic', color: '#555' },
    },
    {
      headerName: 'Currency',
      field: 'currencies.SHP.name',
      sortable: true,
      filter: true,
      width: 200,
      cellStyle: { backgroundColor: '#e8f5e9', paddingLeft: '10px' },
    },
    {
      headerName: 'Symbol',
      field: 'currencies.SHP.symbol',
      width: 100,
      cellStyle: { textAlign: 'center', fontSize: '18px' },
    },
    {
      headerName: 'Language',
      field: 'languages.eng',
      sortable: true,
      filter: true,
      width: 150,
      cellStyle: { textAlign: 'center', fontFamily: 'Arial' },
    },
    {
      headerName: 'Population',
      field: 'population',
      sortable: true,
      filter: true,
      width: 150,
      cellStyle: (params) => ({
        color: params.value
      }),
    },
  ]);

  useEffect(() => {
  fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched Data:', data); // Log the raw data fetched from the API
      setRowData(data);
    })
    .catch((error) => console.error('Error fetching data:', error));
}, []);


  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Country Information</h2>
      <div
        className="ag-theme-alpine"
        style={{
          height: '600px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <AgGridReact
          rowData={rowData}
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
