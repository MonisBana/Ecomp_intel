import React, { Component, Fragment } from "react";
//import { useSubheader } from "../../_metronic/layout";
import { DropdownButton, Dropdown, Button } from "react-bootstrap";
import axios from "../../axios-order";
import DatePicker from "react-datepicker";
import classes from "./MyPage.module.css";

export class MyPage extends Component {
  state = {
    brands: [],
    selectedBrand: "Select Brand",
    L1s: [],
    selectedL1: "Select L1",
    L2s: [],
    selectedL2: "Select L2",
    L3s: [],
    selectedL3: "Select L3",
    date: "",
    res: "",
  };
  componentDidMount() {
    axios
      .post("/populateBrand/")
      .then((res) => {
        const brands = res.data;
        console.log(brands)
        this.setState({ brands });
      })
      .catch((error) => console.log(error.response));

    axios
      .post("/populateL1/")
      .then((res) => {
        const L1s = res.data;
        this.setState({ L1s });
      });
  }
  brandHandler = (eventKey, event) => {
    console.log(eventKey);
    this.setState({ selectedBrand: eventKey });
  };

  L1Handler = (eventKey, event) => {
    console.log(eventKey);
    this.setState({ selectedL1: eventKey });
    axios
      .post(
        "/populateL2/",
        JSON.stringify({ brand: this.state.selectedBrand, L1: eventKey })
      )
      .then((res) => {
        const L2s = res.data;
        this.setState({ L2s });
      });
  };

  L2Handler = (eventKey, event) => {
    this.setState({ selectedL2: eventKey });
    axios
      .post(
        "/populateL3/",
        JSON.stringify({
          brand: this.state.selectedBrand,
          L1: this.state.selectedL1,
          L2: eventKey,
        })
      )
      .then((res) => {
        const L3s = res.data;
        this.setState({ L3s });
      });
  };
  L3Handler = (eventKey, event) => {
    this.setState({ selectedL3: eventKey });
  };
  getResultHandler = () => {
    const date = this.state.date;
    const formattedDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    const data = JSON.stringify({
      brand: this.state.selectedBrand,
      L1: this.state.selectedL1,
      L2: this.state.selectedL2,
      L3: this.state.selectedL3,
      date: formattedDate,
    });
    axios.post("/populateResult/", data).then((res) => {
      console.log(res.data);
      //this.setState({ res });
    });
  };
  render() {
    // const suhbeader = useSubheader();
    // suhbeader.setTitle("My Custom title");

    return (
      <Fragment>
        <DropdownButton
          id="dropdown-item-button"
          title={this.state.selectedBrand}
          onSelect={this.brandHandler}
          className={classes.Dropdown}
        >
          {this.state.brands.map((brand, index) => (
            <Dropdown.Item eventKey={brand} key={index} as="button">
              {brand}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-item-button"
          title={this.state.selectedL1}
          onSelect={this.L1Handler}
          className={classes.Dropdown}
        >
          {this.state.L1s.map((L1, index) => (
            <Dropdown.Item eventKey={L1} key={index} as="button">
              {L1}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-item-button"
          title={this.state.selectedL2}
          onSelect={this.L2Handler}
          className={classes.Dropdown}
        >
          {this.state.L2s.map((L2, index) => (
            <Dropdown.Item eventKey={L2} key={index} as="button">
              {L2}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-item-button"
          title={this.state.selectedL3}
          onSelect={this.L3Handler}
          className={classes.Dropdown}
        >
          {this.state.L3s.map((L3, index) => (
            <Dropdown.Item eventKey={L3} key={index} as="button">
              {L3}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DatePicker
          selected={this.state.date}
          onChange={(date) => this.setState({ date })}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          className={classes.Dropdown}
          placeholderText="Click to select a date"
        />
        {/* <p>{this.state.selectedBrand}</p>
        <p>{this.state.selectedL1}</p>
        <p>{this.state.selectedL2}</p>
        <p>{this.state.selectedL3}</p> */}

        <Button variant="primary" onClick={this.getResultHandler}>
          Submit
        </Button>
        <p>{this.state.res}</p>
      </Fragment>
    );
  }
}

export default MyPage;
