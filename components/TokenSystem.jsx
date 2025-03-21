import { useState, useEffect, useRef } from "react";
import ItemList from "./ItemList";
import QuickAccess from "./QuickAccess";
// import { renderToString } from "react-dom/server";
import ReceiptComponent from "./ReceiptComponent";
// import { useReactToPrint } from "react-to-print";

const TokenSystem = () => {
  let receiptRef = useRef();
  let [buyList, setBuyList] = useState([]);
  let [totalCost, setTotalCost] = useState(0);
  let [orders, setOrders] = useState([]);
  let [token, setToken] = useState(1);

  const addSaleToDb = async () => {
    let response = await fetch("http://localhost:3000/sales/add", {
      method: "POST",
      body: JSON.stringify(buyList),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
  };

  const handleTokenSystem = async (event) => {
    event.preventDefault();
    let receipt = { orderNumber: token, items: buyList, total: totalCost };
    let response = await fetch("http://192.168.1.4:3000/sales/printToken", {
      method: "POST",
      body: JSON.stringify(receipt),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    setBuyList([]);
    setTotalCost(0);

    let tokenTemp = token;
    setToken(parseInt(tokenTemp) + 1);
    addSaleToDb();
  };

  const handleBuyList = (index, event) => {
    console.log(index, event);
    let buyListCopy = [...buyList];
    if (event.target.name == "cost") {
      buyListCopy[index][event.target.name] = parseInt(event.target.value);
    } else {
      buyListCopy[index][event.target.name] = event.target.value;
    }

    if (event.target.name == "quantity" || event.target.name == "rate") {
      buyListCopy[index]["cost"] =
        parseFloat(buyListCopy[index]["rate"]) * parseFloat(event.target.value);
    }
    if (event.target.name == "cost") {
      buyListCopy[index]["quantity"] =
        "" +
        (buyListCopy[index]["cost"] / buyListCopy[index]["rate"]).toFixed(3);
    }
    let totalCostTemp = 0;
    for (let i of buyListCopy) {
      totalCostTemp += i.cost;
    }
    setTotalCost(totalCostTemp);
    setBuyList(buyListCopy);
    console.log(buyList);
  };

  const handleAdd = (item, quantity, rate, cost, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(item, quantity, rate);
    let buyListCopy = [...buyList];
    let itemExists = false;
    for (let i of buyListCopy) {
      if (i["item"] == item) {
        buyListCopy[buyListCopy.indexOf(i)]["quantity"] =
          parseFloat(buyListCopy[buyListCopy.indexOf(i)]["quantity"]) +
          parseFloat(quantity);
        buyListCopy[buyListCopy.indexOf(i)]["cost"] =
          parseFloat(buyListCopy[buyListCopy.indexOf(i)]["cost"]) + cost;
        itemExists = true;
        break;
      }
    }
    if (!itemExists) {
      buyListCopy.push({
        id: buyList.length + 1,
        item: item,
        quantity: quantity,
        rate: rate,
        cost: parseFloat(cost),
        token: token,
      });
    }
    setBuyList(buyListCopy);
    let totalCostTemp = 0;
    for (let i of buyListCopy) {
      totalCostTemp += i.cost;
    }
    setTotalCost(totalCostTemp);
    console.log(buyListCopy);
  };

  const handleRemove = (e, index) => {
    console.log("remove");
    e.preventDefault();
    let temp = totalCost;
    temp = temp - buyList[index].cost;
    let buyListCopy = [...buyList];
    buyListCopy.splice(index, 1);
    setBuyList(buyListCopy);

    setTotalCost(temp);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const fetch_token = async () => {
    let response = await fetch("http://localhost:3000/sales/getLastToken");
    response = await response.json();
    setToken(response[0].token + 1);
  };
  useEffect(() => {
    fetch_token();
  }, []);

  return (
    <>
      <div className="flex">
        <QuickAccess handleAdd={handleAdd}></QuickAccess>
        <div className="ml-5">
          <h1 className="mt-2 font-bold text-5xl">
            Token :{" "}
            <input
              type="number"
              name="token"
              value={token}
              onChange={handleTokenChange}
            ></input>
          </h1>
          <form>
            <div className="container mt-2 flex flex-column justify-evenly align-center border w-full mx-auto shadow-lg p-4">
              <ItemList handleAdd={handleAdd}></ItemList>
            </div>
          </form>
          <div className="w-full mx-auto flex flex-column justify-evenly">
            {buyList.length > 0 ? (
              <div>
                <table className="mt-10 border">
                  <thead>
                    <tr className="border">
                      <th className="border">Item</th>
                      <th className="border">Quantity</th>
                      <th className="border">Rate</th>
                      <th className="border">Cost</th>
                      <th className="border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyList.map((item, index) => (
                      <tr key={index}>
                        <td className="border">
                          <input
                            type="text"
                            name="item"
                            value={item.item}
                            onChange={(e) => handleBuyList(index, e)}
                          ></input>
                        </td>
                        <td className="border">
                          <input
                            type="text"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleBuyList(index, e)}
                          ></input>
                        </td>
                        <td className="border">
                          {" "}
                          <input
                            type="number"
                            name="rate"
                            readOnly
                            value={item.rate}
                            onChange={(e) => handleBuyList(index, e)}
                          ></input>
                        </td>
                        <td className="border">
                          {" "}
                          <input
                            type="text"
                            name="cost"
                            value={item.cost}
                            onChange={(e) => {
                              if (!isNaN(item.cost)) {
                                handleBuyList(index, e);
                              }
                            }}
                          ></input>
                        </td>
                        <td className="">
                          <button
                            className="bg-red-500 text-white px-4"
                            onClick={(e) => handleRemove(e, index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="font-extrabold">Total</td>
                      <td></td>
                      <td></td>
                      <td className="font-extrabold">{totalCost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <>Add Item</>
            )}
          </div>
          <div className="w-full flex justify-center">
            <button
              className="bg-yellow-500 px-5 mt-10 shadow-lg "
              onClick={handleTokenSystem}
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* invoice part */}
      {/* 
      <div className="flex center justify-end w-full">
        <ReceiptComponent
          ref={receiptRef}
          buyList={buyList}
          total={totalCost}
          token={token}
        />
      </div> */}
    </>
  );
};

export default TokenSystem;
