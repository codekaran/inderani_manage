import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const SELLING_TYPES = [
  { value: "WEIGHT", label: "Weight" },
  { value: "PIECE", label: "Piece" },
  { value: "PLATE", label: "Plate" },
  { value: "GLASS", label: "Glass" },
  { value: "CUSTOM", label: "Custom" },
];

function ProductForm({
  categories,
  product,
  onClose,
  onSaved,
}) {
  const isEditMode = Boolean(product);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [options, setOptions] = useState([
    {
      name: "",
      selling_type: "WEIGHT",
      price: "",
    },
  ]);

  const [modifiers, setModifiers] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PRODUCT INTO FORM WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (!product) {
      // ADD MODE
      setName("");
      setDescription("");
      setCategoryId("");

      setOptions([
        {
          name: "",
          selling_type: "WEIGHT",
          price: "",
        },
      ]);

      setModifiers([]);
      setError("");

      return;
    }

    // EDIT MODE
    setName(product.name || "");
    setDescription(product.description || "");
    setCategoryId(String(product.category_id || ""));

    setOptions(
      product.options?.length
        ? product.options.map((option) => ({
            id: option.id,
            name: option.name || "",
            selling_type: option.selling_type || "WEIGHT",
            price: option.price ?? "",
          }))
        : [
            {
              name: "",
              selling_type: "WEIGHT",
              price: "",
            },
          ]
    );

    setModifiers(
      product.modifiers?.map((modifier) => ({
        id: modifier.id,
        name: modifier.name || "",
        price: modifier.price ?? "",
      })) || []
    );

    setError("");
  }, [product]);

  // ==========================================
  // OPTIONS
  // ==========================================

  const addOption = () => {
    setOptions([
      ...options,
      {
        name: "",
        selling_type: "WEIGHT",
        price: "",
      },
    ]);
  };

  const removeOption = (index) => {
    if (options.length === 1) return;

    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, field, value) => {
    const updated = [...options];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setOptions(updated);
  };

  // ==========================================
  // MODIFIERS
  // ==========================================

  const addModifier = () => {
    setModifiers([
      ...modifiers,
      {
        name: "",
        price: "",
      },
    ]);
  };

  const removeModifier = (index) => {
    setModifiers(
      modifiers.filter((_, i) => i !== index)
    );
  };

  const updateModifier = (index, field, value) => {
    const updated = [...modifiers];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setModifiers(updated);
  };

  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    // ------------------------------------------
    // VALIDATE OPTIONS
    // ------------------------------------------

    for (const option of options) {
      if (!option.name.trim()) {
        setError(
          "Every selling option needs a name."
        );
        return;
      }

      if (
        option.price === "" ||
        Number(option.price) < 0
      ) {
        setError(
          "Every selling option needs a valid price."
        );
        return;
      }

      if (!option.selling_type) {
        setError(
          "Every selling option needs a selling type."
        );
        return;
      }
    }

    // ------------------------------------------
    // VALIDATE MODIFIERS
    // ------------------------------------------

    for (const modifier of modifiers) {
      if (!modifier.name.trim()) {
        setError("Every modifier needs a name.");
        return;
      }

      if (
        modifier.price === "" ||
        Number(modifier.price) < 0
      ) {
        setError(
          "Every modifier needs a valid price."
        );
        return;
      }
    }

    // ------------------------------------------
    // PREPARE DATA
    // ------------------------------------------

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category_id: Number(categoryId),

      options: options.map((option) => ({
        ...(option.id
          ? { id: option.id }
          : {}),
        name: option.name.trim(),
        selling_type: option.selling_type,
        price: Number(option.price),
      })),

      modifiers: modifiers.map((modifier) => ({
        ...(modifier.id
          ? { id: modifier.id }
          : {}),
        name: modifier.name.trim(),
        price: Number(modifier.price),
      })),
    };

    // ------------------------------------------
    // EDIT MODE
    // ------------------------------------------

    if (isEditMode) {
      productData.active =
        product.active === undefined
          ? true
          : Boolean(product.active);
    }

    try {
      setSaving(true);

      const url = isEditMode
        ? `${API_URL}/api/products/${product.id}`
        : `${API_URL}/api/products`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update product."
              : "Failed to create product.")
        );
      }

      onSaved();

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update product details, prices and options"
                : "Add a product and its selling options"}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>

        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-5"
        >

          {/* BASIC DETAILS */}

          <div className="grid gap-4 md:grid-cols-2">

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Product Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Gulab Jamun"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
              />

            </div>

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#8B1E1E]"
              >

                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-4">

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Optional description"
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#8B1E1E]"
            />

          </div>

          {/* SELLING OPTIONS */}

          <div className="mt-6">

            <div className="mb-3 flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-gray-900">
                  Selling Options
                </h3>

                <p className="text-xs text-gray-500">
                  How customers can buy this product
                </p>

              </div>

              <button
                type="button"
                onClick={addOption}
                className="rounded-lg border border-[#8B1E1E] px-3 py-2 text-sm font-medium text-[#8B1E1E] hover:bg-red-50"
              >
                + Add Option
              </button>

            </div>

            <div className="space-y-3">

              {options.map((option, index) => (

                <div
                  key={option.id || `new-${index}`}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                >

                  <div className="grid gap-3 md:grid-cols-[1fr_150px_120px_auto]">

                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Option name e.g. Per Kg"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#8B1E1E]"
                    />

                    <select
                      value={option.selling_type}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "selling_type",
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#8B1E1E]"
                    >

                      {SELLING_TYPES.map((type) => (

                        <option
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </option>

                      ))}

                    </select>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={option.price}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="Price"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#8B1E1E]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOption(index)
                      }
                      disabled={options.length === 1}
                      className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* MODIFIERS */}

          <div className="mt-6">

            <div className="mb-3 flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-gray-900">
                  Modifiers
                </h3>

                <p className="text-xs text-gray-500">
                  Optional extras such as Butter or Pure Ghee
                </p>

              </div>

              <button
                type="button"
                onClick={addModifier}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                + Add Modifier
              </button>

            </div>

            {modifiers.length === 0 ? (

              <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">
                No modifiers added
              </div>

            ) : (

              <div className="space-y-3">

                {modifiers.map(
                  (modifier, index) => (

                    <div
                      key={
                        modifier.id ||
                        `new-${index}`
                      }
                      className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 md:grid-cols-[1fr_150px_auto]"
                    >

                      <input
                        type="text"
                        value={modifier.name}
                        onChange={(e) =>
                          updateModifier(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Modifier name e.g. Butter"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#8B1E1E]"
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={modifier.price}
                        onChange={(e) =>
                          updateModifier(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="Price"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#8B1E1E]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeModifier(index)
                        }
                        className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* FOOTER */}

          <div className="mt-6 flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#8B1E1E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#721818] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Save Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ProductForm;