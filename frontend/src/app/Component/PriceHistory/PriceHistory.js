import React, { Component } from "react";
import axios from "../../../axios-base";
import DataTable from "react-data-table-component";
import LinearIndeterminate from "../LinearProgress/LinearProgress";
import classes from "./PriceHistory.module.css";
import { Line } from "react-chartjs-2";
import { Card, Row } from "react-bootstrap";

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
        this.setState({ priceHistory: res.data, pending: false });
      });
  }
  backHandler = () => {
    this.props.history.goBack();
  };
  render() {
    let graphConfig = {
      labels: this.state.priceHistory.map((product) => product.dt),

      datasets: [
        {
          label: "Price",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(78, 121, 167, 0.2)",
          borderColor: "rgba(78, 121, 167,1)",
          borderWidth: 2,
          data: this.state.priceHistory.map((product) => product.price),
        },
        {
          label: "Digi1 Price",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgb(225, 87, 89,0.2 )",
          borderColor: "rgba(225, 87, 89, 1)",
          borderWidth: 2,
          data: this.state.priceHistory.map((product) => product.dprice),
        },
      ],
    };

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
        <Row className="align-item-center justify-content-center">
          <Card style={{ width: "80%" }}>
            <Line
              data={graphConfig}
              options={{
                title: {
                  display: true,
                  text: "Price History",
                  fontSize: 20,
                  fontFamily: "Poppins",
                  fontWeight: 400,
                },
                legend: {
                  display: true,
                  position: "top",
                },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        drawOnChartArea: false,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      gridLines: {
                        drawOnChartArea: false,
                      },
                    },
                  ],
                },
              }}
            />
          </Card>
        </Row>
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
