import React from "react";

const Orders = (props) => {
  const ordersList = [
    {
      id: 1,
      name: "Santosh",
      mobile: "1234567890",
      address: "NA",
      boxes: 40,
      orderDeilveryDate: "2025-02-28",
      time: "19:00",
      bhajiStatus: "Pending",
      boxStatus: "Completed",
      bagStatus: "Pending",
      packingStatus: "Pending",
      status: "In progress",
    },
    {
      id: 2,
      name: "Ram",
      mobile: "1234567890",
      address: "NA",
      boxes: 200,
      orderDeilveryDate: "2025-02-28",
      time: "9:00",
      bhajiStatus: "Pending",
      boxStatus: "Pending",
      bagStatus: "Pending",
      packingStatus: "Pending",
      status: "Pending",
    },
  ];
  const headers = [
    "Name",
    "Mobile",
    "Address",
    "Boxes",
    "Order Delivery Date",
    "Time",
    "Bhaji Status",
    "Box Status",
    "Bag Status",
    "Packing Status",
    "Status",
  ];

  return (
    <>
      <h1 className="text-3xl text-center">Orders</h1>

      <h3>Orders this week</h3>
      <h3>All Orders</h3>
      <table>
        <thead className="border">
          {headers.map((header, index) => (
            <th className="border px-2" key={index}>
              {header}
            </th>
          ))}
        </thead>
        <tbody>
          {ordersList.map((order, index) => (
            <tr className="border hover:bg-gray-300" key={index}>
              <td className="border">{order.name}</td>
              <td className="border">{order.mobile}</td>
              <td className="border">{order.address}</td>
              <td className="border">{order.boxes}</td>
              <td className="border">{order.orderDeilveryDate}</td>
              <td className="border">{order.time}</td>
              <td className="border">{order.bhajiStatus}</td>
              <td className="border">{order.boxStatus}</td>
              <td className="border">{order.bagStatus}</td>
              <td className="border">{order.packingStatus}</td>
              <td className="border">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Orders;
