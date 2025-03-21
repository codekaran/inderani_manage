import { useEffect, useState, useRef } from "react";

const ItemList = (props) => {
  const selectRef = useRef();
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState(0);
  const [cost, setCost] = useState(0);
  const [itemName, setItemName] = useState("");
  let [rates, setRates] = useState([]);

  const handleRateChange = (event) => {
    setRate(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    setCost(rate * parseFloat(event.target.value));
  };

  const handleRefChange = () => {
    selectRef.current.focus();
  };
  const handleCostChange = (event) => {
    if (isNaN(parseInt(event.target.value))) {
      return;
    }
    let val = parseInt(event.target.value);
    setCost(val);
    setQuantity("" + (val / rate).toFixed(3));
  };

  const handleItemSelection = (event) => {
    let selectedRate = rates.find((rate) => rate.item === event.target.value);
    console.log(selectedRate);
    setQuantity("1.000");
    setRate(selectedRate["rate"]);
    setItemName(selectedRate["item"]);
    setCost(selectedRate["rate"]);
    console.log(itemName);
  };

  async function fetch_rates() {
    let response = await fetch("http://localhost:3000/rates");
    response = await response.json();
    console.log(response);
    setRates(response);
    setRate(response[0].rate);
    setQuantity("1.000");
    setItemName(response[0].item);
    setCost(response[0].rate);
  }

  useEffect(() => {
    fetch_rates();
  }, []);

  return (
    <>
      <div className="">
        <label htmlFor="item" className="font-semibold">
          Item:
        </label>
        <select
          ref={selectRef}
          name="item"
          id="item"
          className="w-full border border-gray-300"
          onChange={handleItemSelection}
        >
          {rates.map((rate) => (
            <option key={rate.id} value={rate.item}>
              {rate.item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block font-semibold">
          Quantity:
        </label>
        <input
          name="quantity"
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={handleQuantityChange}
        />
      </div>
      <div>
        <label htmlFor="rate" className="block font-semibold">
          rate:
        </label>
        <input
          name="rate"
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={handleRateChange}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="cost" className="block font-semibold">
          cost:
        </label>
        <input
          type="text"
          placeholder="Total"
          value={cost}
          onChange={handleCostChange}
        />
      </div>
      <div className="flex justify-center align-items-center">
        <button
          className="bg-blue-500 text-white px-6 "
          onClick={(e) => {
            props.handleAdd(itemName, quantity, rate, cost, e);
            handleRefChange();
          }}
        >
          Add
        </button>
      </div>
    </>
  );
};

export default ItemList;
