import React from "react";

const SaleSuccess = ({ sale, onNewBill }) => {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Payment Successful
        </h2>

        <p className="mt-1 text-center text-gray-500">
          Sale has been saved successfully
        </p>

        {/* Bill Details */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">

          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">
              Bill No.
            </span>

            <span className="font-semibold text-gray-800">
              {sale.bill_number}
            </span>
          </div>

          <div className="flex justify-between border-b py-3">
            <span className="text-gray-500">
              Payment
            </span>

            <span className="font-semibold text-gray-800">
              {sale.payment?.method}
            </span>
          </div>

          <div className="flex justify-between pt-3">
            <span className="text-gray-500">
              Total
            </span>

            <span className="text-xl font-bold text-gray-900">
              ₹{sale.total_amount}
            </span>
          </div>

          {/* Change */}
          {sale.payment?.method === "CASH" &&
            Number(sale.payment?.change_amount) > 0 && (
              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">
                  Change
                </span>

                <span className="font-semibold text-green-600">
                  ₹{sale.payment.change_amount}
                </span>
              </div>
            )}

        </div>

        {/* New Bill */}
        <button
          onClick={onNewBill}
          className="mt-6 w-full rounded-xl bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          New Bill
        </button>

      </div>
    </div>
  );
};

export default SaleSuccess;