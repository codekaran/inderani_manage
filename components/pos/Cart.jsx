function Cart({
  cart,
  subtotal,
  onRemoveItem,
  onClearCart,
  onPayment,
}) {
  return (
    <div className="flex h-[calc(100vh-80px)] min-h-0 flex-col bg-white">

      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Current Bill
          </h2>

          <p className="text-sm text-gray-500">
            {cart.length} item
            {cart.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Clear
          </button>
        )}

      </div>

      {/* ITEMS */}
      <div className="min-h-0 flex-1 overflow-y-auto">

        {cart.length === 0 ? (
          <div className="flex h-full items-center justify-center p-6 text-center">

            <div>

              <div className="mb-2 text-4xl">
                🛒
              </div>

              <p className="font-semibold text-gray-700">
                No items added
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Select products to start the bill
              </p>

            </div>

          </div>
        ) : (
          <div className="divide-y">

            {cart.map((item) => (
              <div
                key={`${item.product_id}-${item.product_option_id}-${(
                  item.modifiers || []
                )
                  .map(
                    (modifier) =>
                      modifier.id
                  )
                  .sort(
                    (a, b) =>
                      a - b
                  )
                  .join("-")}`}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  {/* ITEM */}
                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-gray-900">
                      {item.product_name}
                    </h3>

                    {item.option_name && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.option_name}
                      </p>
                    )}

                    {/* MODIFIERS */}
                    {item.modifiers?.length >
                      0 && (
                      <div className="mt-1">

                        {item.modifiers.map(
                          (modifier) => (
                            <p
                              key={
                                modifier.id
                              }
                              className="text-xs text-red-600"
                            >
                              +{" "}
                              {
                                modifier.name
                              }{" "}
                              ₹
                              {Number(
                                modifier.price
                              ).toFixed(
                                0
                              )}
                            </p>
                          )
                        )}

                      </div>
                    )}

                    {/* QUANTITY */}
                    <div className="mt-2 text-sm text-gray-600">
                      {item.quantity_text}
                    </div>

                    {/* UNIT PRICE */}
                    <div className="mt-1 text-xs text-gray-400">
                      ₹
                      {Number(
                        item.unit_price
                      ).toFixed(2)}

                      {item.selling_type ===
                      "WEIGHT"
                        ? " / kg"
                        : " each"}
                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="text-right">

                    <div className="font-bold text-gray-900">
                      ₹
                      {Number(
                        item.total_price
                      ).toFixed(2)}
                    </div>

                    <button
                      onClick={() =>
                        onRemoveItem(
                          item
                        )
                      }
                      className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t bg-white p-5">

        <div className="mb-4 flex items-center justify-between">

          <span className="text-base font-semibold text-gray-600">
            Subtotal
          </span>

          <span className="text-2xl font-bold text-gray-900">
            ₹
            {Number(
              subtotal
            ).toFixed(2)}
          </span>

        </div>

        <button
          onClick={onPayment}
          disabled={cart.length === 0}
          className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Payment
        </button>

      </div>

    </div>
  );
}

export default Cart;