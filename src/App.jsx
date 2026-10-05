import "./App.css";
import TokenSystem from "../components/TokenSystem";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Orders from "../components/Orders";
import ItemManager from "../components/item-manager/ItemManager";
import POS from "../components/pos/POS";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<TokenSystem />} /> */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/items" element={<ItemManager />} />
        <Route path="/" element={<POS />} />
      </Routes>
    </Router>
  );
}

export default App;