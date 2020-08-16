import React, { useState } from "react";
import axios from "../../../axios-base";
import Spinner from "../Spinner/Spinner";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const TrendChart = (props) => {
  const [trendData, setTrendData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  let graph = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Spinner />
    </div>
  );
  if (!trendData) {
    axios
      .post(
        "/priceTrendHistory/",
        JSON.stringify({
          sku_id: props.sku_id,
        })
      )
      .then((res) => {
        setChartOptions({
          title: {
            text: "Price Trend",
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
              data: res.data.map((product) => product.fprice),
              name: "Flipkart",
            },
            {
              data: res.data.map((product) => product.aprice),
              name: "Amazon",
            },
            {
              data: res.data.map((product) => product.tprice),
              name: "Tata",
            },
            {
              data: res.data.map((product) => product.pprice),
              name: "Paytm",
            },
          ],
        });
        setTrendData(res.data);
      });
  }
  if (trendData) {
    graph = <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }
  return <div>{graph}</div>;
};
export default TrendChart;
