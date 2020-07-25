import React, { Component } from "react";
//import { useSubheader } from "../../_metronic/layout";
import { connect } from "react-redux";
import classes from "./MyPage.module.css";
import { NavLink } from "react-router-dom";
import axios from "../../axios-base";
import * as types from "../../redux/types/type";
import Modal from "../Component/Modal/Modal";
import TrendChart from "../Component/TrendChart/TrendChart";
import FilterProducts from "../Component/FilterProducts/FilterProducts";
import DataTable from "../Component/DataTableComponent/DataTableComponent";
const conditionalCellStyle = {
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
};
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
        style: conditionalCellStyle,
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
        style: conditionalCellStyle,
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
        style: conditionalCellStyle,
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
        style: conditionalCellStyle,
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
        style: conditionalCellStyle,
      },
    ],
  },
  {
    name: "Lowest Price",
    selector: "Lowescast",
    omit: true,
  },
];

class MyPage extends Component {
  graph;
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      showModal: false,
    };
  }

  onRowClickHandler = (row) => {
    this.setState({ showModal: true });
    this.graph = <TrendChart sku_id={row.sku_id} />;
  };

  closeModal = () => {
    this.setState({ showModal: false });
    this.graph = null;
  };
  enablePending = () => {
    this.setState({ pending: true });
  };
  disablePending = () => {
    this.setState({ pending: false });
  };
  getResultHandler = (
    selectedBrand,
    selectedL1,
    selectedL2,
    selectedL3,
    selectedDate,
    Oos,
    LLimit,
    ULimit
  ) => {
    this.enablePending();
    let date = selectedDate;
    let Llimit = LLimit;
    let Ulimit = ULimit;
    if (Llimit == null) {
      Llimit = 0;
    }
    if (Ulimit == null) {
      Ulimit = 0;
    }
    const formattedDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    const data = JSON.stringify({
      brand: selectedBrand,
      L1: selectedL1,
      L2: selectedL2,
      L3: selectedL3,
      Oos: Oos,
      Llimit: Llimit,
      Ulimit: Ulimit,
      date: formattedDate,
    });
    console.log(data);
    axios.post("/populateResult/", data).then((res) => {
      this.props.getCurrentPrice(res.data);
      this.disablePending();
    });
  };

  render() {
    // const suhbeader = useSubheader();
    // suhbeader.setTitle("My Custom title");

    let table = [];
    if (this.props.currentPrices) {
      table = (
        <DataTable
          title="Price report"
          columns={columns}
          data={this.props.currentPrices}
          pending={this.state.pending}
          onRowClicked={this.onRowClickHandler}
        />
      );
    }
    return (
      <div className="container-fluid">
        <FilterProducts getResultHandler={this.getResultHandler} />
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
