import React, { forwardRef } from "react";

const ReceiptComponent = forwardRef(({ buyList, total, token }, ref) => (
  <>
    <div ref={ref} className="w-fit flex flex-col">
      <h1 className="font-bold text-center">Token: {token}</h1>
      <table>
        <thead>
          <tr className="text-sm border">
            <th className="w-1/4">Item</th>
            <th className="w-1/2">Qty</th>
            <th className="w-1/2">Rate</th>
            <th className="w-1/2">Cost</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {buyList.map((item, index) => (
            <tr key={index} className="border">
              <td className="px-2">{item.item}</td>
              <td className="px-2">{item.quantity}</td>
              <td className="px-2">{item.rate}</td>
              <td className="px-2">{item.cost}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="px-2">Total</td>
            <td></td>
            <td></td>
            <td className="px-2">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
));

export default ReceiptComponent;
