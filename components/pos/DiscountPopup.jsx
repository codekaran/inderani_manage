import { useState } from "react";

function DiscountPopup({ subtotal, onClose, onApply }) {
  const [type, setType] = useState("AMOUNT");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");

  const numericValue = Number(value) || 0;

  const discountAmount =
    type === "AMOUNT"
      ? Math.min(numericValue, subtotal)
      : Math.min((subtotal * numericValue) / 100, subtotal);

  const handleApply = () => {
    if (numericValue <= 0) {
      alert("Please enter a discount.");
      return;
    }

    if (type === "PERCENTAGE" && numericValue > 100) {
      alert("Percentage discount cannot exceed 100%.");
      return;
    }

    onApply({
      type,
      value: numericValue,
      reason: reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Apply Discount
            </h2>
            <p className="text-sm text-gray-500">
              Subtotal: ₹{Number(subtotal).toFixed(2)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-gray-400 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Discount type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Discount Type
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("AMOUNT")}
                className={`rounded-xl border py-3 font-semibold ${
                  type === "AMOUNT"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                ₹ Amount
              </button>

              <button
                type="button"
                onClick={() => setType("PERCENTAGE")}
                className={`rounded-xl border py-3 font-semibold ${
                  type === "PERCENTAGE"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {type === "AMOUNT"
                ? "Discount Amount"
                : "Discount Percentage"}
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                max={type === "PERCENTAGE" ? 100 : undefined}
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === "AMOUNT" ? "e.g. 50" : "e.g. 10"}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-red-500"
                autoFocus
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                {type === "AMOUNT" ? "₹" : "%"}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reason
            </label>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Regular customer"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{Number(subtotal).toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-red-600">
              <span>Discount</span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="mt-3 flex justify-between border-t pt-3">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{(subtotal - discountAmount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700"
            >
              Apply Discount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountPopup;