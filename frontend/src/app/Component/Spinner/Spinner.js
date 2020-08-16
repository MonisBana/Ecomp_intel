import React from "react";
import { Spinner } from "react-bootstrap";

function SpinnerComponnet() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner
        size="lg"
        animation="border"
        variant="primary"
        style={{
          width: "6rem",
          height: "6rem",
          border: "0.5em solid currentColor",
          opacity: "0.9",
          borderRightColor: "transparent",
          borderRadius: "50%",
          animation: " spinner-border .75s linear infinite",
        }}
      />
    </div>
  );
}

export default SpinnerComponnet;
