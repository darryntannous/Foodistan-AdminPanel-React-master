import React from "react";

const Wrapper = props => {
  return (
    <div
      style={{
        paddingLeft: "2%",
        paddingRight: "2%",
        paddingTop: "1%",
        paddingBottom: "1%",
        ...props.parentStyle
      }}
    >
      {props.children}
    </div>
  );
};

export default Wrapper;
