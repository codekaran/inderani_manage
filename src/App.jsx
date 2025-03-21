import { useState } from "react";
import "./App.css";
import TokenSystem from "../components/TokenSystem";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Orders from "../components/Orders";

function App() {
  return (
    <>
      <Router>
        {/* <Nav> */}
        <Routes>
          <Route path="/" element={<TokenSystem />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        {/* </Nav> */}
      </Router>
    </>
  );
}

export default App;
