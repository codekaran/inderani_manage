import React from "react";

const SaleSuccess = ({
  sale,
  onPrintTokenAndBill,
  onPrintBill,
  onPrintToken,
  onFinishWithoutPrinting,
  onNewBill,
  printing = false,
}) => {
  if (!sale) return null;

  const handleFinishWithoutPrinting = () => {
    if (printing) return;

    if (onFinishWithoutPrinting) {
      onFinishWithoutPrinting();
    } else if (onNewBill) {
      onNewBill();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
      <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">

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
          <div className="flex justify-between gap-3 border-b pb-3">
            <span className="text-gray-500">Bill No.</span>
            <span className="font-semibold text-gray-800">
              {String(sale.bill_number ?? "").padStart(4, "0")}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-b py-3">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-800">
              {sale.payment?.method || "N/A"}
            </span>
          </div>

          <div className="flex justify-between gap-3 pt-3">
            <span className="text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ₹{Number(sale.total_amount || 0).toFixed(2)}
            </span>
          </div>

          {/* Change */}
          {sale.payment?.method === "CASH" &&
            Number(sale.payment?.change_amount) > 0 && (
              <div className="mt-3 flex justify-between gap-3">
                <span className="text-gray-500">Change</span>
                <span className="font-semibold text-green-600">
                  ₹{Number(sale.payment.change_amount).toFixed(2)}
                </span>
              </div>
            )}
        </div>

        {/* Printing Options */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onPrintTokenAndBill}
            disabled={printing}
            className="w-full rounded-xl bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎟 Token + Bill
          </button>

          <button
            type="button"
            onClick={onPrintBill}
            disabled={printing}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🧾 Bill Only
          </button>

          <button
            type="button"
            onClick={onPrintToken}
            disabled={printing}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎟 Token Only
          </button>
        </div>

        {/* Finish Without Printing */}
        <button
          type="button"
          onClick={handleFinishWithoutPrinting}
          disabled={printing}
          className="mt-4 w-full rounded-xl border border-green-300 bg-green-50 py-3 text-base font-semibold text-green-800 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ✓ Finish Without Printing
        </button>

        {/* Start Another Bill */}
        <button
          type="button"
          onClick={onNewBill}
          disabled={printing}
          className="mt-3 w-full rounded-xl bg-gray-100 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New Bill
        </button>

        {printing && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Printing...
          </p>
        )}
      </div>
    </div>
  );
};

export default SaleSuccess;