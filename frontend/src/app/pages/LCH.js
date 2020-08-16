import React, { Component, Fragment } from "react";
import { ButtonGroup, Button, Card } from "react-bootstrap";
import axios from "../../axios-base";
import FilterProducts from "../Component/FilterProducts/FilterProducts";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DataTable from "../Component/DataTableComponent/DataTableComponent";
import Spinner from "../Component/Spinner/Spinner";

class LCH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphBtnVariant: "primary",
      tableBtnVariant: "light",
      params: {
        udelta: 0,
        brand: "0",
        L1: "0",
        L2: "0",
        L3: "0",
        Llimit: 0,
        Ulimit: 100000,
        date: "0000-00-00",
      },
      data: null,
      chartOptions: {},
      pending: false,
      reqPending: false,
      toggle: true,
      showDetailLCH: false,
      LCHdata: [],
    };
  }

  columns = [
    {
      name: "LCH",
      selector: "LCH",
      sortable: true,
      cell: (row) => (
        <a onClick={() => this.showDetailLCH(row.LCH)}>{row.LCH}</a>
      ),
    },
    {
      name: "Count",
      selector: "count",
      sortable: true,
    },
  ];

  LCHcolumns = [
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
      name: "Digi 1",
      selector: "dprice",
      sortable: true,
    },
    {
      name: "Thumbnail",
      cell: (row) => (
        <img height="80px" width="80px" alt={row.name} src={row.img} />
      ),
    },
    {
      name: "Amazon",
      selector: "aprice",
      sortable: true,
    },
    {
      name: "Flipkart",
      selector: "fprice",
      sortable: true,
    },
    {
      name: "Tata Cliq",
      selector: "tprice",
      sortable: true,
    },
    {
      name: "Paytm Mall",
      selector: "pprice",
      sortable: true,
    },
  ];
  graphBtnHandler = () => {
    this.setState({
      graphBtnVariant: "primary",
      tableBtnVariant: "light",
      toggle: true,
    });
  };
  tableBtnHandler = () => {
    this.setState({
      graphBtnVariant: "light",
      tableBtnVariant: "primary",
      toggle: false,
    });
  };
  getResultHandler = (params) => {
    this.setState({ data: null, reqPending: true });
    const data = JSON.parse(params);
    delete data["Oos"];

    axios.post("/populateLCH/", JSON.stringify(data)).then((res) => {
      this.setState({ data: JSON.parse(res.data), reqPending: false });

      const LCH = JSON.parse(res.data);

      this.setState({
        chartOptions: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
          },
          title: {
            text: "LCH",
          },
          tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
          },
          accessibility: {
            point: {
              valueSuffix: "%",
            },
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b>: {point.percentage:.1f} %",
              },
              showInLegend: true,
            },
          },
          legend: {
            align: "left",
            layout: "vertical",
            verticalAlign: "middle",
            x: 60,
          },
          series: [
            {
              name: "Brands",
              colorByPoint: true,
              data: [
                {
                  name: "H",
                  y: LCH[1].count,
                  sliced: true,
                },
                {
                  name: "L",
                  y: LCH[2].count,
                },
                {
                  name: "C",
                  y: LCH[0].count,
                },
              ],
            },
          ],
        },
      });
    });
  };
  backBtnHandler = () => {
    this.setState({ showDetailLCH: false, LCHdata: [] });
  };

  showDetailLCH = (category) => {
    const params = this.state.params;
    params.uLCH = category;
    this.setState({ pending: true });
    axios
      .post("/populateLCH_Sku/", this.state.params)
      .then((res) => {
        this.setState({ LCHdata: JSON.parse(res.data), pending: false });
      })
      .then(this.setState({ showDetailLCH: true }));
  };
  render() {
    let table = [];
    let cardContent = null;
    let spinner = null;
    if (this.state.LCHdata) {
      table = (
        <DataTable
          title="LCH Detail"
          columns={this.LCHcolumns}
          data={this.state.LCHdata}
          pending={this.state.pending}
        />
      );
    }
    if (this.state.data) {
      cardContent = (
        <div>
          <ButtonGroup type="checkbox">
            <Button
              variant={this.state.graphBtnVariant}
              onClick={this.graphBtnHandler}
            >
              <i class="fa fa-pie-chart" aria-hidden="true"></i>
            </Button>
            <Button
              variant={this.state.tableBtnVariant}
              onClick={this.tableBtnHandler}
            >
              <i class="fa fa-table" aria-hidden="true"></i>
            </Button>
          </ButtonGroup>
          <br></br>
          {this.state.toggle ? (
            <Card show={this.state.data}>
              <HighchartsReact
                highcharts={Highcharts}
                options={this.state.chartOptions}
              />
              ;
            </Card>
          ) : (
            <Card>
              <div style={{ marginInline: "60px" }}>
                <DataTable
                  title="LCH"
                  columns={this.columns}
                  data={this.state.data}
                />
              </div>
            </Card>
          )}
        </div>
      );
    }
    if (this.state.reqPending) {
      spinner = <Spinner />;
    }
    return (
      <Fragment>
        <div className="container-fluid">
          <div className="row">
            <FilterProducts getResultHandler={this.getResultHandler} hideOos />
          </div>
          <br></br>
          {this.state.showDetailLCH ? (
            <div>
              <Button
                style={{ marginBottom: "5px" }}
                onClick={this.backBtnHandler}
              >
                <i class="fas fa-angle-double-left"></i> Back
              </Button>

              <Card>{table}</Card>
            </div>
          ) : (
            cardContent
          )}
        </div>
        {spinner}
      </Fragment>
    );
  }
}
export default LCH;
