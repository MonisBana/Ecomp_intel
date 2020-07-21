import React, { Component } from "react";
//import { useSubheader } from "../../_metronic/layout";
import { Button } from "react-bootstrap";
// import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Form, InputGroup } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "../../axios-base";
import DatePicker from "react-datepicker";
import classes from "./MyPage.module.css";
import DataTable from "react-data-table-component";
import LinearIndeterminate from "../Component/LinearProgress/LinearProgress";
import { NavLink } from "react-router-dom";
import * as types from "../../redux/types/type";
import Modal from "../Component/Modal/Modal";
import TrendChart from "../Component/TrendChart/TrendChart";

const columns = [
  {
    name: "SKU_Id",
    selector: "sku_id",
  },
  {
    name: "Name",
    selector: "title",
    wrap: true,
    format: (row) => `${row.title.slice(0, 75)}...`,
  },
  {
    name: "Brand",
    selector: "brand",
  },

  {
    name: "Digi 1",
    selector: "digip",
    sortable: true,
    cell: (row) => (
      <a href={row.digi_url} target="_blank" className={classes.notActive}>
        <p>{row.digip}</p>
      </a>
    ),
  },
  {
    name: "Thumbnail",
    cell: (row) => (
      <img height="80px" width="80px" alt={row.name} src={row.digi_img} />
    ),
  },
  {
    name: "Amazon",
    selector: "amazonp",
    sortable: true,
    cell: (row) => (
      <NavLink to={"PriceHistory/amazon/" + row.sku_id}>
        <p className={classes.notActive}>{row.amazonp}</p>
      </NavLink>
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.amazonp == row.Lowescast,
        style: {
          p: {
            color: "#F64E60 !important",
            backgroundColor: "#FFE2E5",
            fontWeight: 400,
            width: "30%",
            padding: "0.1rem 0.2rem",
            height: "24px",
            fontSize: "0.9rem",
            borderRadius: "0.42rem",
            flexGrow: 0,
            minWidth: "60px",
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    name: "Flipkart",
    selector: "flipkartp",
    sortable: true,
    cell: (row) => (
      <NavLink to={"PriceHistory/flipkart/" + row.sku_id}>
        <p className={classes.notActive}>{row.flipkartp}</p>
      </NavLink>
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.flipkartp == row.Lowescast,
        style: {
          p: {
            color: "#F64E60 !important",
            backgroundColor: "#FFE2E5",
            fontWeight: 400,
            width: "30%",
            padding: "0.1rem 0.2rem",
            height: "24px",
            fontSize: "0.9rem",
            borderRadius: "0.42rem",
            flexGrow: 0,
            minWidth: "60px",
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    name: "Reilance Digital",
    selector: "reliancep",
    sortable: true,
    cell: (row) => (
      <NavLink to={"PriceHistory/reliance/" + row.sku_id}>
        <p className={classes.notActive}>{row.reliancep}</p>
      </NavLink>
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.reliancep == row.Lowescast,
        style: {
          p: {
            color: "#F64E60 !important",
            backgroundColor: "#FFE2E5",
            fontWeight: 400,
            width: "30%",
            padding: "0.1rem 0.2rem",
            height: "24px",
            fontSize: "0.9rem",
            borderRadius: "0.42rem",
            flexGrow: 0,
            minWidth: "60px",
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    name: "Tata Cliq",
    selector: "tatap",
    sortable: true,
    cell: (row) => (
      <NavLink to={"PriceHistory/tatacliq/" + row.sku_id}>
        <p className={classes.notActive}>{row.tatap}</p>
      </NavLink>
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.tatap == row.Lowescast,
        style: {
          p: {
            color: "#F64E60 !important",
            backgroundColor: "#FFE2E5",
            fontWeight: 400,
            width: "30%",
            padding: "0.1rem 0.2rem",
            height: "24px",
            fontSize: "0.9rem",
            borderRadius: "0.42rem",
            flexGrow: 0,
            minWidth: "60px",
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    name: "Paytm Mall",
    selector: "paytmp",
    sortable: true,
    cell: (row) => (
      <NavLink to={"PriceHistory/paytm/" + row.sku_id}>
        <p className={classes.notActive}>{row.paytmp}</p>
      </NavLink>
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.paytmp == row.Lowescast,
        style: {
          p: {
            color: "#F64E60 !important",
            backgroundColor: "#FFE2E5",
            fontWeight: 400,
            width: "30%",
            padding: "0.1rem 0.2rem",
            height: "24px",
            fontSize: "0.9rem",
            borderRadius: "0.42rem",
            flexGrow: 0,
            minWidth: "60px",
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    name: "Lowest Price",
    selector: "Lowescast",
    omit: true,
  },
];
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

class MyPage extends Component {
  graph;
  convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(this.props.currentPrices[0]);

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
      selectedBrand: "0",
      L1s: [],
      selectedL1: "0",
      L2s: [],
      selectedL2: "0",
      L3s: [],
      selectedL3: "0",
      date: new Date(),
      res: [],
      pending: false,
      Oos: "0",
      LLimit: null,
      ULimit: null,
      showModal: false,
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
  L1Handler = (event) => {
    console.log(event.target.value);
    this.setState({ selectedL1: event.target.value });
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

  L2Handler = (event) => {
    this.setState({ selectedL2: event.target.value });
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
  getResultHandler = () => {
    this.setState({ res: [], pending: true });
    let date = this.state.date;
    let Llimit = this.state.LLimit;
    let Ulimit = this.state.ULimit;
    if (Llimit == null) {
      Llimit = 0;
    }
    if (Ulimit == null) {
      Ulimit = 0;
    }
    const formattedDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    const data = JSON.stringify({
      brand: this.state.selectedBrand,
      L1: this.state.selectedL1,
      L2: this.state.selectedL2,
      L3: this.state.selectedL3,
      Oos: this.state.Oos,
      Llimit: Llimit,
      Ulimit: Ulimit,
      date: formattedDate,
    });
    axios.post("/populateResult/", data).then((res) => {
      this.props.getCurrentPrice(res.data);
      this.setState({ pending: false });
    });
    // const brand = this.state.selectedBrand;
    // const L1 = this.state.selectedL1;
    // const L2 = this.state.selectedL2;
    // const L3 = this.state.selectedL3;
    // const Oos = this.state.Oos;
    // date = formattedDate;
    // const data = { brand, L1, L2, L3, Oos, Llimit, Ulimit, date };
    // console.log(data);
    // this.props.getCurrentPrice(data);
    // this.setState({ pending: false });
  };
  OutOfStockHandler = (event) => {
    console.log(event.target);
    this.setState({ Oos: event.target.selectedIndex - 1 });
  };
  LLimitHandler = (event) => {
    this.setState({ LLimit: event.target.value.replace(/\D/, "") });
  };
  ULimitHandler = (event) => {
    this.setState({ ULimit: event.target.value.replace(/\D/, "") });
  };
  onRowClickHandler = (row) => {
    this.setState({ showModal: true });
    this.graph = <TrendChart sku_id={row.sku_id} />;
  };

  closeModal = () => {
    this.setState({ showModal: false });
    this.graph = null;
  };

  render() {
    // const suhbeader = useSubheader();
    // suhbeader.setTitle("My Custom title");
    const outOfStock = ["Include Out of Stock", "Not Include Out of Stock"];
    const actionsMemo = (
      <this.Export
        onExport={() => this.downloadCSV(this.props.currentPrices)}
      />
    );
    let table = [];
    if (this.props.currentPrices) {
      table = (
        <DataTable
          className={classes.Price_Table}
          title="Price report"
          keyField="sku_id"
          columns={columns}
          data={this.props.currentPrices}
          customStyles={customStyles}
          pagination
          actions={actionsMemo}
          progressPending={this.state.pending}
          progressComponent={<LinearIndeterminate />}
          persistTableHead
          responsive
          onRowClicked={this.onRowClickHandler}
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
            <Form.Label>Out of Stock</Form.Label>
            <Form.Control
              onChange={this.OutOfStockHandler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Out of Stock
              </option>
              {outOfStock.map((Oos, index) => (
                <option key={index} value={Oos}>
                  {Oos}
                </option>
              ))}
            </Form.Control>
          </div>
          <InputGroup className="col-lg-2" style={{ marginTop: "2rem" }}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <i className="fa fa-inr" aria-hidden="true"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={this.LLimitHandler}
              value={this.state.LLimit}
              placeholder="Price lower limit"
            />
          </InputGroup>
          <InputGroup className="col-lg-2" style={{ marginTop: "2rem" }}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <i className="fa fa-inr" aria-hidden="true"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={this.ULimitHandler}
              value={this.state.ULimit}
              placeholder="Price upper limit"
            />
          </InputGroup>
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
        <Modal show={this.state.showModal} modalClosed={this.closeModal}>
          {this.graph}
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentPrices: state.price.prices,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentPrice: (requestBody) =>
      dispatch({ type: types.GETCURRENTPRICE, payload: requestBody }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
