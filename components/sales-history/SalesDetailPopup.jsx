import { formatAmount, formatTime } from "./salesHistoryUtils";
import { useState } from "react";
import { printHistoricalSale } from "./salesHistoryPrint";
function SaleDetailsPopup({
  sale,
  loading,
  onClose,
}) {
  if (!sale && !loading) {
    return null;
  }
  const [printingType, setPrintingType] = useState("");

const handlePrint = async (type) => {
  if (!sale || printingType) return;

  try {
    setPrintingType(type);

    await printHistoricalSale(sale, type);

    alert(
      type === "BILL_ONLY"
        ? "Bill sent to printer."
        : "Token sent to printer."
    );
  } catch (error) {
    console.error("Historical sale printing error:", error);
    alert(error.message || "Could not print. Check the printer.");
  } finally {
    setPrintingType("");
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading bill details...
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bill #{sale.bill_number}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(sale.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-full px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Items
              </h3>

              <div className="space-y-3">
                {sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product_name}
                        </p>

                        {item.option_name && (
                          <p className="text-xs text-gray-500">
                            {item.option_name}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                          {" × "}
                          {formatAmount(item.unit_price)}
                        </p>

                        {item.modifiers?.length > 0 && (
                          <div className="mt-1">
                            {item.modifiers.map((modifier) => (
                              <p
                                key={modifier.id}
                                className="text-xs text-gray-500"
                              >
                                + {modifier.name}{" "}
                                {formatAmount(modifier.price)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="font-semibold text-gray-900">
                        {formatAmount(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t bg-gray-50 px-6 py-5">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  {formatAmount(sale.subtotal)}
                </span>
              </div>

              {Number(sale.discount_amount) > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">
                    Discount
                  </span>

                  <span className="text-red-600">
                    -{formatAmount(sale.discount_amount)}
                  </span>
                </div>
              )}

              <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>

                <span>
                  {formatAmount(sale.total_amount)}
                </span>
              </div>
            </div>

            {/* Payment */}
            {sale.payments?.length > 0 && (
              <div className="px-6 py-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Payment
                </h3>

                {sale.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Method
                      </span>

                      <span className="font-semibold">
                        {payment.method}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="text-gray-600">
                        Amount
                      </span>

                      <span>
                        {formatAmount(payment.amount)}
                      </span>
                    </div>

                    {payment.method === "CASH" && (
                      <>
                        <div className="mt-2 flex justify-between">
                          <span className="text-gray-600">
                            Received
                          </span>

                          <span>
                            {formatAmount(
                              payment.amount_received
                            )}
                          </span>
                        </div>

                        <div className="mt-2 flex justify-between">
                          <span className="text-gray-600">
                            Change
                          </span>

                          <span className="font-semibold">
                            {formatAmount(
                              payment.change_amount
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            
<div className="flex flex-wrap gap-3 border-t px-6 py-5">
  <button
    onClick={() => handlePrint("BILL_ONLY")}
    disabled={Boolean(printingType)}
    className="flex-1 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {printingType === "BILL_ONLY"
      ? "Printing..."
      : "🖨 Print Bill"}
  </button>

  <button
    onClick={() => handlePrint("TOKEN_ONLY")}
    disabled={Boolean(printingType)}
    className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {printingType === "TOKEN_ONLY"
      ? "Printing..."
      : "🧾 Print Token"}
  </button>

  <button
    onClick={onClose}
    disabled={Boolean(printingType)}
    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
  >
    Close
  </button>
</div>
          </>
        )}
      </div>
    </div>
  );
}

export default SaleDetailsPopup;