import { Link } from "react-router-dom";
import React from "react";

const Nav = () => {
  return (
    <>
      <ul className="flex">
        <Link to="\">Home</Link>
        <Link to="\orders">Orders</Link>
      </ul>
    </>
  );
};

export default Nav;
