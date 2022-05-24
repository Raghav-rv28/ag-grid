import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

function App() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: "agSetColumnFilter" },
    { field: "year", filter: "agNumberColumnFilter" },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }
          const dateParts = cellValue.split("/");
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1] - 1);
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);

          if (cellDate < dateFromFilter) {
            return -1;
          } else if (cellDate > dateFromFilter) {
            return 1;
          }
          return 0;
        },
      },
    },
    { field: "sport", filter: "agMultiColumnFilter" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    enableRowGroup: true,
    floatingFilter: true,
    filterParams: {
      buttons: ["apply", "clear"],
      // deBounceMs: 1000  // delay before render
    },
  }));

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div>
      <button onClick={buttonListener}>Push Me</button>
      <div className="ag-theme-alpine-dark" style={{ height: "100vh" }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          rowGroupPanelShow="always" // Row Grouping done at Users' Discretion.
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}

export default App;
