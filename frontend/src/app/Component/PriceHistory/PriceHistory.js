import React, { Component } from "react";
import axios from "../../../axios-base";
import DataTable from "react-data-table-component";
import LinearIndeterminate from "../LinearProgress/LinearProgress";
import classes from "./PriceHistory.module.css";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
const columns = [
  {
    name: "Comp_id",
    selector: "comp_id",
    omit: true,
  },
  {
    name: "Product Name",
    selector: "title",
    wrap: true,
    format: (row) => `${row.title.slice(0, 75)}...`,
  },
  {
    name: "Date",
    selector: "dt",
  },
  {
    name: "Time",
    selector: "time_tag",
  },
  {
    name: "Price",
    selector: "price",
  },
  {
    name: "MRP",
    selector: "mrp",
  },
  {
    name: "Delivery",
    selector: "delivery",
  },
  {
    name: "Offer",
    selector: "offer",
  },
  {
    name: "Out Of Stock",
    selector: "oos",
  },
  {
    name: "Digi1 Price",
    selector: "dprice",
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
class PriceHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      priceHistory: [],
      pending: false,
      chartOptions: null,
    };
  }
  componentDidMount() {
    this.setState({ pending: true });
    const params = this.props.match.params;
    axios
      .post(
        "/priceHistory/",
        JSON.stringify({
          comp_name: params.comp_name,
          sku_id: params.sku_id,
        })
      )
      .then((res) => {
        this.setState({
          priceHistory: res.data,
          pending: false,
          chartOptions: {
            title: {
              text: "Price History",
            },
            yAxis: {
              title: {
                text: "Price",
              },
            },
            xAxis: {
              type: "datetime",
            },
            plotOptions: {
              series: {
                pointStart: Date.parse(res.data[0].dt),
                pointInterval: 24 * 3600 * 1000,
              },
            },
            series: [
              {
                data: res.data.map((product) => product.dprice),
                name: "Digi1",
              },
              {
                data: res.data.map((product) => product.price),
                name: "Competitor",
              },
            ],
          },
        });
      });
  }
  backHandler = () => {
    this.props.history.goBack();
  };
  render() {
    let table = null;
    let graph = null;
    if (this.state.priceHistory) {
      table = (
        <DataTable
          className={classes.PriceHistory_Table}
          columns={columns}
          data={this.state.priceHistory}
          title="Price History"
          customStyles={customStyles}
          pagination
          progressPending={this.state.pending}
          progressComponent={<LinearIndeterminate />}
          persistTableHead
          responsive
        />
      );
    }
    if (this.state.priceHistory) {
      graph = (
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state.chartOptions}
        />
      );
    }
    return (
      <div>
        <button onClick={this.backHandler}>Back</button>
        {graph}
        {table}
      </div>
    );
  }
}
export default PriceHistory;
