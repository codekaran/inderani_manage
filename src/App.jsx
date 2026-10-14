
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Orders from "../components/Orders";
import ItemManager from "../components/item-manager/ItemManager";
import POS from "../components/pos/POS";
import SalesHistory from "../components/sales-history/SalesHistory";
import AppLayout from "../components/layout/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<POS />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/items" element={<ItemManager />} />
          <Route path="/sales-history" element={<SalesHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
