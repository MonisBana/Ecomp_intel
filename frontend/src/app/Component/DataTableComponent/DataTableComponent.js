import React from "react";
import DataTable from "react-data-table-component";
import LinearIndeterminate from "../LinearProgress/LinearProgress";
import { Button } from "react-bootstrap";
import classes from "./DataTableComponent.module.css";

const DataTableComponent = (props) => {
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(props.data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;
        if (item[key] == null) item[key] = "";
        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const Export = ({ onExport }) => (
    <Button onClick={(e) => onExport(e.target.value)}>Export</Button>
  );
  const actionsMemo = <Export onExport={() => downloadCSV(props.data)} />;
  const customStyles = {
    cells: {
      style: {
        fontFamily: "Poppins",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        color: "#b5b5c3 !important",
        fontSize: "0.9rem",
        textTransform: "uppercase",
        letterSpacing: "0.1rem",
      },
    },
    table: {
      style: {
        color: "#464E5F",
      },
    },
    header: {
      style: {
        margin: "0 0.75rem 0 0",
        fontWeight: "500",
        fontSize: "1.275rem",
        color: "#212121",
      },
    },
  };

  return (
    <DataTable
      className={classes.Price_Table}
      title={props.title}
      columns={props.columns}
      data={props.data}
      customStyles={customStyles}
      pagination
      actions={actionsMemo}
      progressPending={props.pending}
      progressComponent={<LinearIndeterminate />}
      persistTableHead
      responsive
      onRowClicked={props.onRowClicked}
      expandableRows={props.expandableRows}
      expandableRowsComponent={props.expandableRowsComponent}
    />
  );
};

export default DataTableComponent;
