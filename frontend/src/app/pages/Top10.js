import React, { Component } from "react";
import axios from "../../axios-base";
import { Row, Form, Button, Col, Card } from "react-bootstrap";
import DataTable from "../Component/DataTableComponent/DataTableComponent";
const columns = [
  {
    name: "SKU_ID",
    selector: "sku_id",
  },
  {
    name: "Brand",
    selector: "brand",
    sortable: true,
  },
  {
    name: "Category",
    selector: "L1",
    sortable: true,
  },
  {
    name: "Comp Percentage",
    selector: "comp_percentage",
    cell: (row) => <p>{Number(row.comp_percentage).toFixed(2)}</p>,
  },
];
class Top10 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      L1s: [],
      selectedBrand: "0",
      selectedL1: "0",
      top10: [],
      worst10: [],
      pending: false,
    };
  }
  componentDidMount() {
    this.setState({ pending: true });
    axios
      .post(
        "top10/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: this.state.selectedL1,
        })
      )
      .then((res) => this.setState({ top10: res.data, pending: false }));
    axios
      .post(
        "worst10/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: this.state.selectedL1,
        })
      )
      .then((res) => this.setState({ worst10: res.data, pending: false }));
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
    this.setState({ selectedL1: event.target.value });
  };
  getTop10Handler = () => {
    this.setState({ pending: false });
    axios
      .post(
        "top10/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: this.state.selectedL1,
        })
      )
      .then((res) => this.setState({ top10: res.data, pending: false }));
  };
  render() {
    let top10_table = [];
    let worst10_table = [];
    if (this.state.top10) {
      top10_table = (
        <DataTable
          title="Top 10"
          columns={columns}
          data={this.state.top10}
          pending={this.state.pending}
        />
      );
    }
    if (this.state.worst10) {
      worst10_table = (
        <DataTable
          title="Worst 10"
          columns={columns}
          data={this.state.worst10}
          pending={this.state.pending}
        />
      );
    }
    return (
      <div>
        <Row>
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
            <Button
              style={{ marginTop: "2rem" }}
              variant="primary"
              onClick={this.getTop10Handler}
            >
              Submit
            </Button>
          </div>
        </Row>
        <Row>
          <Col lg={6}>{top10_table}</Col>
          <Col lg={6}>{worst10_table}</Col>
        </Row>
      </div>
    );
  }
}

export default Top10;
