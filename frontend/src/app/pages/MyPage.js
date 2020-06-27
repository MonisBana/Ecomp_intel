import React, { Component, Fragment } from "react";
//import { useSubheader } from "../../_metronic/layout";
import { Button } from "react-bootstrap";
// import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { Form } from "react-bootstrap";

import axios from "../../axios-order";
import DatePicker from "react-datepicker";
import classes from "./MyPage.module.css";
import DataTable from "react-data-table-component";
import LinearIndeterminate from "../Component/LinearProgress";

const columns = [
  {
    name: "SKU_Id",
    selector: "sku_id",
  },
  {
    name: "Amazon",
    selector: "amz_price",
    sortable: true,
  },
  {
    name: "Flipkart",
    selector: "fkt_price",
    sortable: true,
  },
  {
    name: "Croma",
    selector: "cr_price",
    sortable: true,
  },
  {
    name: "Reilance Digital",
    selector: "rd_price",
    sortable: true,
  },
  {
    name: "Snapdeal",
    selector: "sd_price",
    sortable: true,
  },
  {
    name: "Tata Cliq",
    selector: "tc_price",
    sortable: true,
  },
  {
    name: "Paytm Mall",
    selector: "pp_price",
    sortable: true,
  },
];
const customStyles = {
  cells: {
    style: {
      fontFamily: "Poppins",
    },
  },
};

export class MyPage extends Component {
  convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(this.state.res[0]);

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

  downloadCSV(array) {
    const link = document.createElement("a");
    let csv = this.convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  Export = ({ onExport }) => (
    <Button onClick={(e) => onExport(e.target.value)}>Export</Button>
  );
  getCurDate(sp) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return yyyy + sp + mm + sp + dd;
    // return today
  }

  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      selectedBrand: null,
      L1s: [],
      selectedL1: null,
      L2s: [],
      selectedL2: null,
      L3s: [],
      selectedL3: null,
      date: new Date(),
      res: [],
      pending: false,
    };
  }

  componentDidMount() {
    axios
      .post("/populateBrand/")
      .then((res) => {
        const brands = res.data;
        this.setState({ brands });
      })
      .catch((error) => console.log(error.response));

    axios.post("/populateL1/").then((res) => {
      const L1s = res.data;
      this.setState({ L1s });
    });
  }

  brandHandler = (event) => {
    this.setState({ selectedBrand: event.target.value });
  };

  L1Handler = (eventKey, event) => {
    console.log(eventKey);
    this.setState({ selectedL1: eventKey });
    axios
      .post(
        "/populateL2/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: event.target.value,
        })
      )
      .then((res) => {
        const L2s = res.data;
        console.log("L2s -> ", L2s);
        this.setState({ L2s: L2s });
      });
  };

  L2Handler = (eventKey, event) => {
    this.setState({ selectedL2: eventKey });
    axios
      .post(
        "/populateL3/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: this.state.selectedL1,
          L2: event.target.value,
        })
      )
      .then((res) => {
        const L3s = res.data;
        this.setState({ L3s });
      });
  };
  L3Handler = (eventKey, event) => {
    this.setState({ selectedL3: eventKey });
  };
  getResultHandler = () => {
    this.setState({ res: [], pending: true });
    const date = this.state.date;
    const formattedDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    const data = JSON.stringify({
      brand: this.state.selectedBrand,
      L1: this.state.selectedL1,
      L2: this.state.selectedL2,
      L3: this.state.selectedL3,
      date: formattedDate,
    });
    axios.post("/populateResult/", data).then((res) => {
      console.log(res.data);
      this.setState({ res: res.data, pending: false });
    });
  };

  render() {
    // const suhbeader = useSubheader();
    // suhbeader.setTitle("My Custom title");
    const actionsMemo = (
      <this.Export onExport={() => this.downloadCSV(this.state.res)} />
    );
    let table = [];
    if (this.state.res) {
      table = (
        <DataTable
          className={classes.Price_Table}
          title="Price report"
          columns={columns}
          data={this.state.res}
          customStyles={customStyles}
          pagination
          highlightOnHover
          pointerOnHover
          actions={actionsMemo}
          progressPending={this.state.pending}
          progressComponent={<LinearIndeterminate />}
          persistTableHead
        />
      );
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            <Form.Label>Date</Form.Label>
            <DatePicker
              selected={this.state.date}
              onChange={(date) => this.setState({ date })}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              className="form-control"
              placeholderText="Click to select a date"
            />
          </div>
          <div className="col-lg-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              onChange={this.brandHandler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Select Brand
              </option>
              {this.state.brands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </Form.Control>
          </div>
          <div className="col-lg-2">
            <Form.Label>L1</Form.Label>
            <Form.Control
              onChange={this.L1Handler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Select L1
              </option>
              {this.state.L1s.map((L1, index) => (
                <option key={index} value={L1}>
                  {L1}
                </option>
              ))}
            </Form.Control>
          </div>
          <div className="col-lg-2">
            <Form.Label>L2</Form.Label>
            <Form.Control
              onChange={this.L2Handler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Select L2
              </option>
              {this.state.L2s.map((L2, index) => (
                <option key={index} value={L2}>
                  {L2}
                </option>
              ))}
            </Form.Control>
          </div>
          <div className="col-lg-2">
            <Form.Label>L3</Form.Label>
            <Form.Control
              onChange={this.L3Handler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Select L3
              </option>
              {this.state.L3s.map((L3, index) => (
                <option key={index} value={L3}>
                  {L3}
                </option>
              ))}
            </Form.Control>
          </div>
          <div className="col-lg-2">
            <Button
              style={{ marginTop: "2rem" }}
              variant="primary"
              onClick={this.getResultHandler}
            >
              Submit
            </Button>
          </div>
        </div>
        {table}
      </div>
    );
  }
}

export default MyPage;
