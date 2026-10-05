import { useEffect, useState } from "react";

function ProductPopup({ product, onClose, onAddToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Weight stored internally in grams
  const [weight, setWeight] = useState(1000);

  // Editable KG field
  const [weightInput, setWeightInput] = useState("1");

  // Piece / plate / glass quantity
  const [quantity, setQuantity] = useState(1);

  // Custom ₹ amount
  const [amount, setAmount] = useState("");

  // Selected modifiers
  const [selectedModifiers, setSelectedModifiers] = useState([]);

  const isWeight =
    selectedOption?.selling_type === "WEIGHT";

  useEffect(() => {
    if (!product?.options?.length) return;

    const defaultOption = product.options.find(
      (option) => option.active !== 0
    );

    setSelectedOption(defaultOption || product.options[0]);

    setWeight(1000);
    setWeightInput("1");
    setQuantity(1);
    setAmount("");
    setSelectedModifiers([]);
  }, [product]);

  if (!product) return null;

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const getPricePerKg = () => {
    if (!selectedOption) return 0;

    return Number(selectedOption.price);
  };

  const getModifierTotal = () => {
    return selectedModifiers.reduce(
      (total, modifier) =>
        total + Number(modifier.price),
      0
    );
  };

  const calculateWeightPrice = () => {
    const pricePerKg = getPricePerKg();

    return (pricePerKg * weight) / 1000;
  };

  const calculateWeightFromAmount = () => {
    const pricePerKg = getPricePerKg();

    if (!pricePerKg || !amount) return 0;

    return (Number(amount) / pricePerKg) * 1000;
  };

  const getBaseTotal = () => {
    if (!selectedOption) return 0;

    if (isWeight) {
      if (amount !== "") {
        return Number(amount);
      }

      return calculateWeightPrice();
    }

    return Number(selectedOption.price) * quantity;
  };

  const getTotal = () => {
    const baseTotal = getBaseTotal();

    // Modifiers are applied once per quantity.
    return (
      baseTotal +
      getModifierTotal() *
        (isWeight ? 1 : quantity)
    );
  };

  // --------------------------------------------------
  // DISPLAY WEIGHT
  // --------------------------------------------------

  const formatWeight = (grams) => {
    if (grams >= 1000) {
      const kg = grams / 1000;

      return `${Number.isInteger(kg)
        ? kg
        : kg.toFixed(3)} kg`;
    }

    return `${grams} g`;
  };

  // --------------------------------------------------
  // QUANTITY TEXT
  // --------------------------------------------------

  const getQuantityText = () => {
    if (isWeight) {
      if (amount !== "") {
        const calculatedWeight =
          calculateWeightFromAmount();

        return `${formatWeight(
          calculatedWeight
        )} (₹${Number(amount).toFixed(0)})`;
      }

      return formatWeight(weight);
    }

    return `${quantity} ${
      selectedOption?.selling_type === "PIECE"
        ? quantity === 1
          ? "pc"
          : "pcs"
        : selectedOption?.selling_type === "PLATE"
        ? quantity === 1
          ? "plate"
          : "plates"
        : selectedOption?.selling_type === "GLASS"
        ? quantity === 1
          ? "glass"
          : "glasses"
        : "units"
    }`;
  };

  // --------------------------------------------------
  // MODIFIERS
  // --------------------------------------------------

  const toggleModifier = (modifier) => {
    setSelectedModifiers((current) => {
      const alreadySelected = current.some(
        (item) => item.id === modifier.id
      );

      if (alreadySelected) {
        return current.filter(
          (item) => item.id !== modifier.id
        );
      }

      return [...current, modifier];
    });
  };

  // --------------------------------------------------
  // QUICK WEIGHT
  // --------------------------------------------------

  const handleQuickWeight = (grams) => {
    setWeight(grams);
    setWeightInput(String(grams / 1000));
    setAmount("");
  };

  // --------------------------------------------------
  // EDITABLE KG
  // --------------------------------------------------

  const handleWeightInputChange = (value) => {
    setWeightInput(value);
    setAmount("");

    if (value === "") {
      return;
    }

    const kg = Number(value);

    if (!Number.isNaN(kg) && kg > 0) {
      setWeight(kg * 1000);
    }
  };

  // --------------------------------------------------
  // WEIGHT + / -
  // --------------------------------------------------

  const handleWeightIncrease = () => {
    const newWeight = weight + 250;

    setWeight(newWeight);
    setWeightInput(String(newWeight / 1000));
    setAmount("");
  };

  const handleWeightDecrease = () => {
    const newWeight = Math.max(
      250,
      weight - 250
    );

    setWeight(newWeight);
    setWeightInput(String(newWeight / 1000));
    setAmount("");
  };

  // --------------------------------------------------
  // PIECE + / -
  // --------------------------------------------------

  const handleQuantityIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleQuantityDecrease = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAdd = () => {
    if (!selectedOption) return;

    let finalQuantity;
    let finalUnitPrice;
    let finalTotal;
    let quantityText;

    if (isWeight) {
      if (amount !== "") {
        const enteredAmount = Number(amount);

        if (
          !enteredAmount ||
          enteredAmount <= 0
        ) {
          alert(
            "Please enter a valid amount."
          );
          return;
        }

        finalQuantity =
          calculateWeightFromAmount() / 1000;

        finalUnitPrice = getPricePerKg();
        finalTotal =
          enteredAmount +
          getModifierTotal();

        quantityText =
          getQuantityText();
      } else {
        if (!weight || weight <= 0) {
          alert(
            "Please enter a valid weight."
          );
          return;
        }

        finalQuantity = weight / 1000;
        finalUnitPrice = getPricePerKg();

        finalTotal =
          calculateWeightPrice() +
          getModifierTotal();

        quantityText =
          formatWeight(weight);
      }
    } else {
      finalQuantity = quantity;
      finalUnitPrice =
        Number(selectedOption.price);

      finalTotal =
        finalUnitPrice * quantity +
        getModifierTotal() * quantity;

      quantityText =
        getQuantityText();
    }

    const cartItem = {
      product_id: product.id,
      product_name: product.name,

      product_option_id:
        selectedOption.id,
      option_name:
        selectedOption.name,
      selling_type:
        selectedOption.selling_type,

      quantity: finalQuantity,
      unit_price: finalUnitPrice,
      total_price: finalTotal,

      quantity_text: quantityText,

      // Save selected modifiers
      modifiers: selectedModifiers.map(
        (modifier) => ({
          id: modifier.id,
          name: modifier.name,
          price: Number(modifier.price),
        })
      ),
    };

    onAddToCart(cartItem);
    onClose();
  };

  const sellingType =
    selectedOption?.selling_type;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product.name}
            </h2>

            {selectedOption && (
              <p className="mt-1 text-sm text-gray-500">
                ₹
                {Number(
                  selectedOption.price
                ).toFixed(2)}
                {sellingType ===
                  "WEIGHT" &&
                  " / kg"}
              </p>
            )}
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

          {/* OPTIONS */}
          {product.options?.length > 1 && (
            <div>

              <p className="mb-2 text-sm font-semibold text-gray-700">
                Select option
              </p>

              <div className="grid grid-cols-2 gap-2">

                {product.options
                  .filter(
                    (option) =>
                      option.active !== 0
                  )
                  .map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedOption(
                          option
                        );

                        setAmount("");
                        setQuantity(1);
                        setWeight(1000);
                        setWeightInput("1");
                        setSelectedModifiers(
                          []
                        );
                      }}
                      className={`rounded-xl border px-4 py-3 text-left ${
                        selectedOption?.id ===
                        option.id
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >

                      <div className="font-semibold">
                        {option.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        ₹
                        {Number(
                          option.price
                        ).toFixed(2)}
                        {option.selling_type ===
                          "WEIGHT" &&
                          " / kg"}
                      </div>

                    </button>
                  ))}

              </div>

            </div>
          )}

          {/* =========================================
              WEIGHT
          ========================================= */}
          {isWeight && (
            <div className="space-y-4">

              <p className="text-sm font-semibold text-gray-700">
                Select weight
              </p>

              {/* QUICK WEIGHTS */}
              <div className="grid grid-cols-3 gap-2">

                {[250, 500, 1000].map(
                  (grams) => (
                    <button
                      key={grams}
                      onClick={() =>
                        handleQuickWeight(
                          grams
                        )
                      }
                      className={`rounded-xl border px-3 py-3 font-semibold ${
                        weight === grams &&
                        amount === ""
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-red-400"
                      }`}
                    >
                      {grams >= 1000
                        ? `${grams / 1000} kg`
                        : `${grams} g`}
                    </button>
                  )
                )}

              </div>

              {/* EDITABLE KG */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Weight in kg
                </label>

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      handleWeightDecrease
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold hover:bg-gray-200"
                  >
                    −
                  </button>

                  <div className="relative flex-1">

                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={weightInput}
                      onChange={(e) =>
                        handleWeightInputChange(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 pr-12 text-center text-xl font-bold outline-none focus:border-red-500"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                      kg
                    </span>

                  </div>

                  <button
                    onClick={
                      handleWeightIncrease
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold hover:bg-gray-200"
                  >
                    +
                  </button>

                </div>

                <p className="mt-2 text-center text-sm text-gray-500">
                  ₹
                  {calculateWeightPrice().toFixed(
                    2
                  )}
                </p>

              </div>

              {/* CUSTOM AMOUNT */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Or enter custom ₹ amount
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    placeholder="Example: 500"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-lg outline-none focus:border-red-500"
                  />

                </div>

                {amount && (
                  <p className="mt-2 text-sm text-gray-500">
                    Approx.{" "}
                    {formatWeight(
                      calculateWeightFromAmount()
                    )}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* =========================================
              PIECE / PLATE / GLASS
          ========================================= */}
          {!isWeight &&
            selectedOption && (
              <div>

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Quantity
                </p>

                <div className="flex items-center justify-between rounded-xl bg-gray-100 p-3">

                  <button
                    onClick={
                      handleQuantityDecrease
                    }
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl font-bold shadow-sm"
                  >
                    −
                  </button>

                  <div className="text-center">

                    <div className="text-2xl font-bold">
                      {quantity}
                    </div>

                    <div className="text-sm text-gray-500">
                      {sellingType ===
                      "PIECE"
                        ? quantity === 1
                          ? "piece"
                          : "pieces"
                        : sellingType ===
                          "PLATE"
                        ? quantity === 1
                          ? "plate"
                          : "plates"
                        : sellingType ===
                          "GLASS"
                        ? quantity === 1
                          ? "glass"
                          : "glasses"
                        : "units"}
                    </div>

                  </div>

                  <button
                    onClick={
                      handleQuantityIncrease
                    }
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl font-bold shadow-sm"
                  >
                    +
                  </button>

                </div>

                {/* QUICK QUANTITIES */}
                <div className="mt-3 grid grid-cols-4 gap-2">

                  {[1, 2, 5, 10].map(
                    (qty) => (
                      <button
                        key={qty}
                        onClick={() =>
                          setQuantity(qty)
                        }
                        className={`rounded-xl border py-3 font-semibold ${
                          quantity === qty
                            ? "border-red-600 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-red-400"
                        }`}
                      >
                        {qty}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =========================================
              MODIFIERS
          ========================================= */}
          {product.modifiers?.filter(
            (modifier) =>
              modifier.active !== 0
          ).length > 0 && (
            <div>

              <div className="mb-3 flex items-center justify-between">

                <p className="text-sm font-semibold text-gray-700">
                  Add-ons
                </p>

                <span className="text-xs text-gray-400">
                  Optional
                </span>

              </div>

              <div className="space-y-2">

                {product.modifiers
                  .filter(
                    (modifier) =>
                      modifier.active !== 0
                  )
                  .map((modifier) => {

                    const isSelected =
                      selectedModifiers.some(
                        (item) =>
                          item.id ===
                          modifier.id
                      );

                    return (
                      <button
                        key={modifier.id}
                        onClick={() =>
                          toggleModifier(
                            modifier
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-red-400"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                              isSelected
                                ? "border-red-600 bg-red-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected &&
                              "✓"}
                          </div>

                          <span className="font-medium">
                            {modifier.name}
                          </span>

                        </div>

                        <span
                          className={`font-semibold ${
                            isSelected
                              ? "text-red-700"
                              : "text-gray-600"
                          }`}
                        >
                          +₹
                          {Number(
                            modifier.price
                          ).toFixed(0)}
                        </span>

                      </button>
                    );
                  })}

              </div>

            </div>
          )}

          {/* =========================================
              TOTAL
          ========================================= */}
          <div className="rounded-xl bg-gray-100 p-4">

            <div className="flex items-center justify-between">

              <div>

                <span className="text-sm text-gray-500">
                  {getQuantityText()}
                </span>

                {selectedModifiers.length >
                  0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {selectedModifiers
                      .map(
                        (modifier) =>
                          modifier.name
                      )
                      .join(" + ")}
                  </div>
                )}

              </div>

              <span className="text-2xl font-bold">
                ₹{getTotal().toFixed(2)}
              </span>

            </div>

          </div>

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
            onClick={handleAdd}
            className="flex-1 rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700"
          >
            Add to Bill
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductPopup;