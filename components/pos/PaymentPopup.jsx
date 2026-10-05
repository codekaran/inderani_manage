import { useEffect, useState } from "react";

function PaymentPopup({
  total,
  onClose,
  onComplete,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("CASH");

  const [cashReceived, setCashReceived] =
    useState("");

  const totalAmount = Number(total) || 0;

  const receivedAmount =
    Number(cashReceived) || 0;

  const change =
    receivedAmount - totalAmount;

  useEffect(() => {
    setCashReceived("");
    setPaymentMethod("CASH");
  }, [total]);

  // --------------------------------------------------
  // PAYMENT VALIDATION
  // --------------------------------------------------

  const isCashValid =
    paymentMethod !== "CASH" ||
    receivedAmount >= totalAmount;

  // --------------------------------------------------
  // COMPLETE PAYMENT
  // --------------------------------------------------

  const handleComplete = () => {
    if (!isCashValid) {
      alert(
        "Cash received is less than the bill amount."
      );
      return;
    }

    const paymentData = {
      method: paymentMethod,
      amount: totalAmount,
      amount_received:
        paymentMethod === "CASH"
          ? receivedAmount
          : totalAmount,
      change_amount:
        paymentMethod === "CASH"
          ? change
          : 0,
    };

    onComplete(paymentData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment
            </h2>

            <p className="text-sm text-gray-500">
              Complete the current bill
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">

          {/* TOTAL */}
          <div className="rounded-xl bg-gray-100 p-5 text-center">

            <p className="text-sm font-medium text-gray-500">
              Total Amount
            </p>

            <p className="mt-1 text-4xl font-bold text-gray-900">
              ₹{totalAmount.toFixed(2)}
            </p>

          </div>

          {/* PAYMENT METHODS */}
          <div>

            <p className="mb-2 text-sm font-semibold text-gray-700">
              Payment Method
            </p>

            <div className="grid grid-cols-3 gap-2">

              {["CASH", "UPI", "CARD"].map(
                (method) => (
                  <button
                    key={method}
                    onClick={() =>
                      setPaymentMethod(method)
                    }
                    className={`rounded-xl border py-4 font-bold ${
                      paymentMethod === method
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {method}
                  </button>
                )
              )}

            </div>

          </div>

          {/* CASH */}
          {paymentMethod === "CASH" && (
            <div className="space-y-3">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Cash Received
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cashReceived}
                    onChange={(e) =>
                      setCashReceived(
                        e.target.value
                      )
                    }
                    placeholder={totalAmount.toFixed(
                      0
                    )}
                    autoFocus
                    className="w-full rounded-xl border-2 border-gray-300 py-4 pl-9 pr-4 text-xl font-bold outline-none focus:border-red-500"
                  />

                </div>

              </div>

              {/* QUICK CASH */}
              <div className="grid grid-cols-4 gap-2">

                {[100, 200, 500, 1000].map(
                  (amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setCashReceived(
                          String(amount)
                        )
                      }
                      className="rounded-lg border border-gray-200 py-2 text-sm font-semibold hover:border-red-400 hover:bg-red-50"
                    >
                      ₹{amount}
                    </button>
                  )
                )}

              </div>

              {/* CHANGE */}
              <div
                className={`rounded-xl p-4 ${
                  change >= 0
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-gray-600">
                    {change >= 0
                      ? "Change"
                      : "Remaining"}
                  </span>

                  <span
                    className={`text-2xl font-bold ${
                      change >= 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    ₹
                    {Math.abs(
                      change
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

            </div>
          )}

          {/* UPI */}
          {paymentMethod === "UPI" && (
            <div className="rounded-xl bg-blue-50 p-5 text-center">

              <div className="text-3xl">
                📱
              </div>

              <p className="mt-2 font-semibold text-gray-800">
                Collect ₹
                {totalAmount.toFixed(2)}
                via UPI
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Confirm after the customer has
                completed the payment.
              </p>

            </div>
          )}

          {/* CARD */}
          {paymentMethod === "CARD" && (
            <div className="rounded-xl bg-purple-50 p-5 text-center">

              <div className="text-3xl">
                💳
              </div>

              <p className="mt-2 font-semibold text-gray-800">
                Collect ₹
                {totalAmount.toFixed(2)}
                by card
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Confirm after the card payment
                has been completed.
              </p>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex gap-3 border-t px-6 py-4">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleComplete}
            disabled={!isCashValid}
            className="flex-1 rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Complete Payment
          </button>

        </div>

      </div>

    </div>
  );
}

export default PaymentPopup;