import React, { useState } from "react";
import axios from "../../../axios-base";
import { Line } from "react-chartjs-2";
import { Card, Row, Spinner } from "react-bootstrap";

const TrendChart = (props) => {
  const [data, setdata] = useState(null);
  let graph = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
  if (!data) {
    axios
      .post(
        "/priceTrendHistory/",
        JSON.stringify({
          sku_id: props.sku_id,
        })
      )
      .then((res) => {
        setdata(res.data);
      });
  }
  let graphConfig = null;
  if (data) {
    graphConfig = {
      labels: data.map((product) => product.dt),
      datasets: [
        {
          label: "Amazon",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(78, 121, 167, 0.2)",
          borderColor: "rgba(78, 121, 167,1)",
          borderWidth: 2,
          data: data.map((product) => product.aprice),
        },
        {
          label: "Flipkart",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86,1)",
          borderWidth: 2,
          data: data.map((product) => product.fprice),
        },
        {
          label: "Paytm",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235,1)",
          borderWidth: 2,
          data: data.map((product) => product.pprice),
        },
        {
          label: "Tata Cliq",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192,1)",
          borderWidth: 2,
          data: data.map((product) => product.tprice),
        },
        {
          label: "Digi1 Price",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgb(225, 87, 89,0.2 )",
          borderColor: "rgba(225, 87, 89, 1)",
          borderWidth: 2,
          data: data.map((product) => product.dprice),
        },
      ],
    };
    graph = (
      <Row className="align-item-center justify-content-center">
        <Card style={{ width: "80%" }}>
          <Line
            data={graphConfig}
            options={{
              title: {
                display: true,
                text: "Price Trend",
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
  return <div>{graph}</div>;
};

export default TrendChart;
