import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classes from "./PriceDrop.module.css";
import DataTable from "../Component/DataTableComponent/DataTableComponent";
import FilterProducts from "../Component/FilterProducts/FilterProducts";
import { connect } from "react-redux";
import * as types from "../../redux/types/type";
import axios from "../../axios-base";
import { OverlayTrigger, Button } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const LightTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const CustomCell = ({ old_price, new_price }) => (
  <LightTooltip
    arrow
    title={
      <React.Fragment>
        <p>
          <span style={{ color: "#F64E60" }}>{old_price}</span> |{" "}
          <span style={{ color: "#1BC5BD" }}>{new_price}</span>
        </p>
      </React.Fragment>
    }
    placement="top"
  >
    <p>{Math.abs(old_price - new_price)}</p>
  </LightTooltip>
);

const conditionalNegativeCellStyle = {
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

const conditionalPositiveCellStyle = {
  p: {
    color: "#1BC5BD !important",
    backgroundColor: "#C9F7F5",
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
    name: "Brand",
    selector: "brand",
  },
  {
    name: "L1",
    selector: "L1",
  },
  {
    name: "Digi 1",
    selector: "dprice_new",
    sortable: true,
    cell: (row) => <p>{row.dprice_old - row.dprice_new}</p>,
  },
  {
    name: "Thumbnail",
    cell: (row) => (
      <img height="80px" width="80px" alt={row.name} src={row.img} />
    ),
  },
  {
    name: "Amazon",
    selector: "aprice_new",
    sortable: true,
    maxWidth: "600px",
    cell: (row) => (
      <CustomCell old_price={row.aprice_old} new_price={row.aprice_new} />
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.aprice_old - row.aprice_new < 0,
        style: conditionalPositiveCellStyle,
      },
      {
        when: (row) => row.aprice_old - row.aprice_new > 0,
        style: conditionalNegativeCellStyle,
      },
    ],
  },
  {
    name: "Flipkart",
    selector: "fprice_new",
    sortable: true,
    cell: (row) => (
      <CustomCell old_price={row.fprice_old} new_price={row.fprice_new} />
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.fprice_old - row.fprice_new < 0,
        style: conditionalPositiveCellStyle,
      },
      {
        when: (row) => row.fprice_old - row.fprice_new > 0,
        style: conditionalNegativeCellStyle,
      },
    ],
  },
  {
    name: "Tata Cliq",
    selector: "rprice_new",
    sortable: true,
    cell: (row) => (
      <CustomCell old_price={row.tprice_old} new_price={row.tprice_new} />
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.tprice_old - row.tprice_new < 0,
        style: conditionalPositiveCellStyle,
      },
      {
        when: (row) => row.tprice_old - row.tprice_new > 0,
        style: conditionalNegativeCellStyle,
      },
    ],
  },
  {
    name: "Paytm Mall",
    selector: "pprice_new",
    sortable: true,
    cell: (row) => (
      <CustomCell old_price={row.pprice_old} new_price={row.pprice_new} />
    ),
    conditionalCellStyles: [
      {
        when: (row) => row.pprice_old - row.pprice_new < 0,
        style: conditionalPositiveCellStyle,
      },
      {
        when: (row) => row.pprice_old - row.pprice_new > 0,
        style: conditionalNegativeCellStyle,
      },
    ],
  },
];

class PriceDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
    };
  }
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
    axios.post("/populatePriceDrop/", data).then((res) => {
      this.props.getPriceDrop(res.data);
      this.disablePending();
    });
  };
  render() {
    let table = [];
    if (this.props.price_drop) {
      table = (
        <DataTable
          title="Price Drop"
          columns={columns}
          data={this.props.price_drop}
          pending={this.state.pending}
        />
      );
    }
    return (
      <div className="container-fluid">
        <FilterProducts getResultHandler={this.getResultHandler} />
        {table}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    price_drop: state.price_drop.price_drop,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getPriceDrop: (data) =>
      dispatch({ type: types.GETPRICEDROP, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceDrop);
