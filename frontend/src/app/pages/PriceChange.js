import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import classes from "./PriceChange.module.css";
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
    <p>
      {Math.abs(old_price - new_price) === 0 ? (
        ""
      ) : (
        <p>
          {Number((Math.abs(old_price - new_price) * 100) / old_price).toFixed(
            2
          )}{" "}
          <span>%</span>
        </p>
      )}
    </p>
  </LightTooltip>
);

const ExpandedComponent = ({ data }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-evenly",
      fontSize: "14px",
      margin: "0.5rem",
    }}
  >
    {(data.aprice === null) |
    (Math.abs(data.aprice_old - data.aprice_new) === 0) ? (
      ""
    ) : (
      <div>
        <p>
          <strong style={{ opacity: 0.9 }}>Amazon old Price:</strong>{" "}
          {data.aprice_old}
        </p>{" "}
        <p>
          <strong style={{ opacity: 0.9 }}>Amazon current Price:</strong>{" "}
          {data.aprice_new}
        </p>
      </div>
    )}
    {(data.fprice === null) |
    (Math.abs(data.fprice_old - data.fprice_new) === 0) ? (
      ""
    ) : (
      <div>
        <p>
          <strong style={{ opacity: 0.9 }}>Flipkart old Price:</strong>{" "}
          {data.fprice_old}
        </p>{" "}
        <p>
          <strong style={{ opacity: 0.9 }}>Flipkart current Price:</strong>{" "}
          {data.fprice_new}
        </p>
      </div>
    )}
    {(data.tprice === null) |
    (Math.abs(data.tprice_old - data.tprice_new) === 0) ? (
      ""
    ) : (
      <div>
        <p>
          <strong style={{ opacity: 0.9 }}>Tata old Price:</strong>{" "}
          {data.tprice_old}
        </p>{" "}
        <p>
          <strong style={{ opacity: 0.9 }}>Tata current Price:</strong>{" "}
          {data.tprice_new}
        </p>
      </div>
    )}
    {(data.pprice === null) |
    (Math.abs(data.pprice_old - data.pprice_new) === 0) ? (
      ""
    ) : (
      <div>
        <p>
          <strong style={{ opacity: 0.9 }}>Paytm old Price:</strong>{" "}
          {data.pprice_old}
        </p>{" "}
        <p>
          <strong style={{ opacity: 0.9 }}>Paytm current Price:</strong>{" "}
          {data.pprice_new}
        </p>
      </div>
    )}
    {(Math.abs(data.aprice_old - data.aprice_new) === 0) &
    (Math.abs(data.fprice_old - data.fprice_new) === 0) &
    (Math.abs(data.tprice_old - data.tprice_new) === 0) &
    (Math.abs(data.pprice_old - data.pprice_new) === 0) ? (
      <div>
        <p>
          <strong>No Price change</strong>
        </p>
      </div>
    ) : (
      ""
    )}
  </div>
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
    name: "Price",
    selector: "dprice_new",
    sortable: true,
    cell: (row) => (
      <p>
        <b style={{ opacity: 0.8 }}>{row.dprice_new}</b>
      </p>
    ),
  },
  {
    name: "Digi 1",
    selector: "dprice_new",
    sortable: true,
    cell: (row) => (
      <CustomCell old_price={row.dprice_old} new_price={row.dprice_new} />
    ),
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

class PriceChange extends Component {
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
  getResultHandler = (data) => {
    this.enablePending();

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
          title="Price Change"
          columns={columns}
          data={this.props.price_drop}
          pending={this.state.pending}
          expandableRows={true}
          expandableRowsComponent={<ExpandedComponent />}
        />
      );
    }
    return (
      <div className="container-fluid">
        <FilterProducts getResultHandler={this.getResultHandler} hideDelta />
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

export default connect(mapStateToProps, mapDispatchToProps)(PriceChange);
