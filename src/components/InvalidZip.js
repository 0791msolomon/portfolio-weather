import React from "react";

const InvalidZip = props => {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <br />
      <br />
      <h1 style={{ color: "red", fontWeight: "bold" }}>
        We were unable to find data for that zip code, please try another.
      </h1>
    </div>
  );
};
export default InvalidZip;
