import React, { Component, Fragment } from "react";
import { ButtonGroup, Button, Card, Form } from "react-bootstrap";
import FilterProducts from "../Component/FilterProducts/FilterProducts";
import axios from "../../axios-base";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DataTable from "../Component/DataTableComponent/DataTableComponent";
import Spinner from "../Component/Spinner/Spinner";

class DiscountGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      DGDetail: [],
      pending: false,
      graphBtnVariant: "primary",
      tableBtnVariant: "light",
      chartOptions: {},
      reqPending: false,
      toggle: true,
      showDGDetail: false,
      selectedComp: "Amazon",
    };
  }
  columns = [
    {
      name: "Discount Bucket",
      selector: "discount",
    },
    {
      name: "Digi1 Amazon",
      selector: "digi1_amazon",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "digi1_amazon"
            )
          }
        >
          {row.digi1_amazon}
        </a>
      ),
    },
    {
      name: "Amazon",
      selector: "amazon",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "amazon"
            )
          }
        >
          {row.amazon}
        </a>
      ),
    },
    {
      name: "Digi1 Flipkart",
      selector: "digi1_fkt",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "digi1_flipkart"
            )
          }
        >
          {row.digi1_fkt}
        </a>
      ),
    },
    {
      name: "Flipkart",
      selector: "flipkart",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "flipkart"
            )
          }
        >
          {row.flipkart}
        </a>
      ),
    },
    {
      name: "Digi1 Tata",
      selector: "digi1_tatacliq",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "digi1_tatacliq"
            )
          }
        >
          {row.digi1_tatacliq}
        </a>
      ),
    },
    {
      name: "Tata",
      selector: "tatacliq",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "tatacliq"
            )
          }
        >
          {row.tatacliq}
        </a>
      ),
    },
    {
      name: "Digi1 Paytm",
      selector: "digi1_paytm",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "digi1_paytm"
            )
          }
        >
          {row.digi1_paytm}
        </a>
      ),
    },
    {
      name: "Paytm",
      selector: "paytm",
      sortable: true,
      cell: (row) => (
        <a
          onClick={() =>
            this.showDGDetail(
              row.discount.replaceAll("%", "").replaceAll(" ", ""),
              "paytm"
            )
          }
        >
          {row.paytm}
        </a>
      ),
    },
  ];
  DGDetailColumns = [
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
      name: "MRP",
      selector: "mrp",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
    {
      name: "Thumbnail",
      cell: (row) => (
        <img height="80px" width="80px" alt={row.name} src={row.img} />
      ),
    },
    {
      name: "Offer",
      selector: "offer",
    },
    {
      name: "Warranty",
      selector: "warranty",
    },
    {
      name: "Installation",
      selector: "installation",
    },
    {
      name: "Oos",
      selector: "Oos",
      sortable: true,
    },
  ];
  Competitons = ["Amazon", "Flipkart", "Tata Cliq", "Paytm"];
  chartOption = {
    chart: {
      type: "column",
    },
    title: {
      text: "Discount",
    },
    subtitle: {
      text: "Digi1 vs Competiton",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Discount %",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
  };
  getResultHandler = (params) => {
    this.setState({ data: null, reqPending: true });
    axios.post("/discount_grid/", params).then((res) => {
      this.setState({
        data: res.data,
        params: JSON.parse(params),
        reqPending: false,
      });
      console.log(res.data);
      this.chartHandler(this.state.selectedComp);
    });
  };
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
  backBtnHandler = () => {
    this.setState({ showDGDetail: false, DGDetail: [] });
  };
  showDGDetail = (discount, comp) => {
    this.setState({ pending: true, showDGDetail: true });
    const params = this.state.params;
    params.discount = discount;
    params.comp = comp;
    axios
      .post("/discount_grid_detail/", params)
      .then((res) => this.setState({ DGDetail: res.data, pending: false }));
  };
  compHandler = (event) => {
    this.setState({ selectedComp: event.target.value });
    this.chartHandler(event.target.value);
  };
  chartHandler = (comp) => {
    this.setState({ chartOptions: {} });
    switch (comp) {
      case "Amazon":
        {
          const chartOpt = {
            ...this.chartOption,
            xAxis: {
              categories: this.state.data.map((product) => product.discount),
            },
            series: [
              {
                data: this.state.data.map((product) => product.digi1_amazon),
                name: "Digi1",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "digi1_amazon"
                      );
                    },
                  },
                },
              },
              {
                data: this.state.data.map((product) => product.amazon),
                name: "Amazon",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "amazon"
                      );
                    },
                  },
                },
              },
            ],
          };
          this.setState({
            chartOptions: chartOpt,
          });
        }
        break;
      case "Flipkart":
        {
          const chartOpt = {
            ...this.chartOption,
            xAxis: {
              categories: this.state.data.map((product) => product.discount),
            },
            series: [
              {
                data: this.state.data.map((product) => product.digi1_fkt),
                name: "Digi1",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "digi1_flipkart"
                      );
                    },
                  },
                },
              },
              {
                data: this.state.data.map((product) => product.flipkart),
                name: "Flipkart",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "flipkart"
                      );
                    },
                  },
                },
              },
            ],
          };
          this.setState({
            chartOptions: chartOpt,
          });
        }
        break;
      case "Tata Cliq":
        {
          const chartOpt = {
            ...this.chartOption,
            xAxis: {
              categories: this.state.data.map((product) => product.discount),
            },
            series: [
              {
                data: this.state.data.map((product) => product.digi1_tatacliq),
                name: "Digi1",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "digi1_tatacliq"
                      );
                    },
                  },
                },
              },
              {
                data: this.state.data.map((product) => product.tatacliq),
                name: "Tata Cliq",
                point: {
                  events: {
                    click: (e) => {
                      this.showDGDetail(
                        e.point.category
                          .replaceAll("%", "")
                          .replaceAll(" ", ""),
                        "tatacliq"
                      );
                    },
                  },
                },
              },
            ],
          };
          this.setState({
            chartOptions: chartOpt,
          });
        }
        break;
      case "Paytm":
        const chartOpt = {
          ...this.chartOption,
          xAxis: {
            categories: this.state.data.map((product) => product.discount),
          },
          series: [
            {
              data: this.state.data.map((product) => product.digi1_paytm),
              name: "Digi1",
              point: {
                events: {
                  click: (e) => {
                    this.showDGDetail(
                      e.point.category.replaceAll("%", "").replaceAll(" ", ""),
                      "digi1_paytm"
                    );
                  },
                },
              },
            },
            {
              data: this.state.data.map((product) => product.paytm),
              name: "Paytm",
              point: {
                events: {
                  click: (e) => {
                    this.showDGDetail(
                      e.point.category.replaceAll("%", "").replaceAll(" ", ""),
                      "paytm"
                    );
                  },
                },
              },
            },
          ],
        };
        this.setState({
          chartOptions: chartOpt,
        });
        break;
    }
  };
  render() {
    let table = [];
    let cardContent = null;
    let spinner = null;
    if (this.state.DGDetail) {
      table = (
        <DataTable
          title="Discount Grid Detail"
          columns={this.DGDetailColumns}
          data={this.state.DGDetail}
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
              <i class="fas fa-chart-bar"></i>
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
              <Card.Body>
                <Card.Title>
                  <div
                    className="col-lg-2"
                    style={{ float: "right", textAlign: "right" }}
                  >
                    <Form.Label>Competition</Form.Label>
                    <Form.Control
                      onChange={this.compHandler}
                      className="custom-select"
                      as="select"
                    >
                      {this.Competitons.map((comp, index) => (
                        <option key={index} value={comp}>
                          {comp}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                </Card.Title>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={this.state.chartOptions}
                />
                ;
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <DataTable
                title="Discount Grid"
                columns={this.columns}
                data={this.state.data}
              />
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
          {this.state.showDGDetail ? (
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

export default DiscountGrid;
