import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "../../../axios-base";
import DatePicker from "react-datepicker";
import * as types from "../../../redux/types/type";

const FilterProducts = (props) => {
  const [brands, setBrands] = useState([]);
  const [L1s, setL1s] = useState([]);
  const [L2s, setL2s] = useState([]);
  const [L3s, setL3s] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("0");
  const [selectedL1, setSelectedL1] = useState("0");
  const [selectedL2, setSelectedL2] = useState("0");
  const [selectedL3, setSelectedL3] = useState("0");
  const [Oos, setSelectedOos] = useState("0");
  const [selectedDate, setDate] = useState(new Date());
  const [LLimit, setLLimit] = useState(0);
  const [ULimit, setULimit] = useState(100000);
  const [Delta, setDelta] = useState(0);

  const outOfStock = ["Include Out of Stock", "Not Include Out of Stock"];

  useEffect(() => {
    axios
      .post("/populateBrand/")
      .then((res) => {
        const brands = res.data;
        setBrands(brands);
      })
      .catch((error) => console.log(error.response));

    axios.post("/populateL1/").then((res) => {
      const L1s = res.data;
      setL1s(L1s);
    });
  }, []);

  const brandHandler = (event) => {
    setSelectedBrand(event.target.value);
  };
  const L1Handler = (event) => {
    setSelectedL1(event.target.value);
    axios
      .post(
        "/populateL2/",
        JSON.stringify({
          brand: selectedBrand,
          L1: event.target.value,
        })
      )
      .then((res) => {
        const L2s = res.data;
        setL2s(L2s);
      });
  };

  const L2Handler = (event) => {
    setSelectedL2(event.target.value);
    axios
      .post(
        "/populateL3/",
        JSON.stringify({
          brand: selectedBrand,
          L1: selectedL1,
          L2: event.target.value,
        })
      )
      .then((res) => {
        const L3s = res.data;
        setL3s(L3s);
      });
  };
  const L3Handler = (event) => {
    setSelectedL3(event.target.value);
  };
  const OutOfStockHandler = (event) => {
    setSelectedOos(event.target.selectedIndex - 1);
  };
  const LLimitHandler = (event) => {
    setLLimit(event.target.value.replace(/\D/, ""));
  };
  const ULimitHandler = (event) => {
    setULimit(event.target.value.replace(/\D/, ""));
  };
  const DeltaHandler = (event) => {
    setDelta(event.target.value.replace(/\D/, ""));
  };

  const getResultHandler = (
    selectedBrand,
    selectedL1,
    selectedL2,
    selectedL3,
    selectedDate,
    Oos,
    LLimit,
    ULimit,
    Delta
  ) => {
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
      Oos,
      Llimit,
      Ulimit,
      date: formattedDate,
      udelta: Delta,
    });
    props.getResultHandler(data);
  };

  return (
    <div className="row">
      <div className="row">
        <div className="col-lg-2">
          <Form.Label>Date</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="form-control"
            placeholderText="Click to select a date"
          />
        </div>
        <div className="col-lg-2">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            onChange={brandHandler}
            className="custom-select"
            as="select"
          >
            <option key="-1" value="0">
              Select Brand
            </option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Control>
        </div>
        <div className="col-lg-2">
          <Form.Label>L1</Form.Label>
          <Form.Control
            onChange={L1Handler}
            className="custom-select"
            as="select"
          >
            <option key="-1" value="0">
              Select L1
            </option>
            {L1s.map((L1, index) => (
              <option key={index} value={L1}>
                {L1}
              </option>
            ))}
          </Form.Control>
        </div>
        <div className="col-lg-2">
          <Form.Label>L2</Form.Label>
          <Form.Control
            onChange={L2Handler}
            className="custom-select"
            as="select"
          >
            <option key="-1" value="0">
              Select L2
            </option>
            {L2s.map((L2, index) => (
              <option key={index} value={L2}>
                {L2}
              </option>
            ))}
          </Form.Control>
        </div>
        <div className="col-lg-2">
          <Form.Label>L3</Form.Label>
          <Form.Control
            onChange={L3Handler}
            className="custom-select"
            as="select"
          >
            <option key="-1" value="0">
              Select L3
            </option>
            {L3s.map((L3, index) => (
              <option key={index} value={L3}>
                {L3}
              </option>
            ))}
          </Form.Control>
        </div>
        {!props.hideOos ? (
          <div className="col-lg-2">
            <Form.Label>Out of Stock</Form.Label>
            <Form.Control
              onChange={OutOfStockHandler}
              className="custom-select"
              as="select"
            >
              <option key="-1" value="0">
                Out of Stock
              </option>
              {outOfStock.map((Oos, index) => (
                <option key={index} value={Oos}>
                  {Oos}
                </option>
              ))}
            </Form.Control>
          </div>
        ) : null}
      </div>
      <div className="row">
        <InputGroup className="col-lg-3" style={{ marginTop: "2rem" }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              <i className="fa fa-inr" aria-hidden="true"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            onChange={LLimitHandler}
            value={LLimit}
            placeholder="Price lower limit"
          />
        </InputGroup>
        <InputGroup className="col-lg-3" style={{ marginTop: "2rem" }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              <i className="fa fa-inr" aria-hidden="true"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            onChange={ULimitHandler}
            value={ULimit}
            placeholder="Price upper limit"
          />
        </InputGroup>
        {!props.hideDelta ? (
          <InputGroup className="col-lg-3" style={{ marginTop: "2rem" }}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <i className="fa fa-inr" aria-hidden="true"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={DeltaHandler}
              value={Delta}
              placeholder="Delta"
            />
          </InputGroup>
        ) : null}
        <div className="col-lg-2">
          <Button
            style={{ marginTop: "2rem" }}
            variant="primary"
            onClick={() =>
              getResultHandler(
                selectedBrand,
                selectedL1,
                selectedL2,
                selectedL3,
                selectedDate,
                Oos,
                LLimit,
                ULimit,
                Delta
              )
            }
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentPrice: (requestBody) =>
      dispatch({ type: types.GETCURRENTPRICE, payload: requestBody }),
  };
};

export default connect(null, mapDispatchToProps)(FilterProducts);
