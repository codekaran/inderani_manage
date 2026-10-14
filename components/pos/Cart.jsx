
function Cart({
  cart,
  subtotal,
  discountAmount,
  discount,
  onRemoveItem,
  onClearCart,
  onPayment,
  onDiscount,
}) {
  const total = Number(subtotal || 0) - Number(discountAmount || 0);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#FFFDF9] text-gray-900">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-amber-100 bg-white px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Current Bill
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {cart.length} {cart.length === 1 ? "item" : "items"} in this order
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 active:scale-95"
          >
            Clear bill
          </button>
        )}
      </div>

      {/* Cart items */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-52 items-center justify-center p-6 text-center">
            <div className="max-w-52">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                🛒
              </div>
              <p className="mt-4 font-semibold text-gray-800">
                Your bill is empty
              </p>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Tap a product to add it to this order.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-amber-100">
            {cart.map((item) => {
              const modifierKey = (item.modifiers || [])
                .map((modifier) => modifier.id)
                .sort((a, b) => a - b)
                .join("-");

              return (
                <div
                  key={`${item.product_id}-${item.product_option_id}-${modifierKey}`}
                  className="px-4 py-4 transition hover:bg-white sm:px-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-bold leading-5 sm:text-base">
                        {item.product_name}
                      </h3>

                      {item.option_name && (
                        <p className="mt-1 text-xs text-gray-500">
                          {item.option_name}
                        </p>
                      )}

                      {item.modifiers?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.modifiers.map((modifier) => (
                            <p
                              key={modifier.id}
                              className="text-xs text-red-700"
                            >
                              + {modifier.name} · ₹
                              {Number(modifier.price).toFixed(2)}
                            </p>
                          ))}
                        </div>
                      )}

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        {item.quantity_text}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        ₹{Number(item.unit_price).toFixed(2)}
                        {item.selling_type === "WEIGHT"
                          ? " / kg"
                          : " each"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="whitespace-nowrap text-base font-bold tabular-nums">
                        ₹{Number(item.total_price).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item)}
                        aria-label={`Remove ${item.product_name}`}
                        className="mt-2 min-h-9 rounded-lg px-2 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bill summary and checkout */}
      <div className="shrink-0 border-t border-amber-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-500">
              Subtotal
            </span>
            <span className="font-semibold tabular-nums">
              ₹{Number(subtotal).toFixed(2)}
            </span>
          </div>

          {Number(discountAmount) > 0 && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-green-700">
                Discount
                {discount?.type === "PERCENTAGE" &&
                  ` (${discount.value}%)`}
              </span>
              <span className="font-semibold text-green-700 tabular-nums">
                − ₹{Number(discountAmount).toFixed(2)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onDiscount}
            disabled={cart.length === 0}
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {Number(discountAmount) > 0
              ? "Edit discount"
              : "＋ Add discount"}
          </button>

          <div className="flex items-center justify-between gap-3 border-t border-dashed border-gray-200 pt-4">
            <span className="text-base font-bold">Total payable</span>
            <span className="text-2xl font-extrabold tracking-tight text-[#8B1E1E] tabular-nums">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={onPayment}
            disabled={cart.length === 0}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#8B1E1E] px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#701717] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            <span>Proceed to Payment</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
