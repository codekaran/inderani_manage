import { useEffect, useState } from "react";

const API_URL = "http://192.168.1.9:3000";
const SELLING_TYPES = [
  { value: "WEIGHT", label: "Weight" },
  { value: "PIECE", label: "Piece" },
  { value: "PLATE", label: "Plate" },
  { value: "GLASS", label: "Glass" },
  { value: "CUSTOM", label: "Custom" },
];
const EMPTY_OPTION = { name: "", selling_type: "WEIGHT", price: "" };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function imageUrl(path) {
  if (!path) return "";
  return /^https?:\/\//i.test(path) ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function ProductForm({ categories = [], product, onClose, onSaved }) {
  const isEditMode = Boolean(product);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [options, setOptions] = useState([{ ...EMPTY_OPTION }]);
  const [modifiers, setModifiers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(product?.name || "");
    setDescription(product?.description || "");
    setCategoryId(product?.category_id ? String(product.category_id) : "");
    setOptions(
      product?.options?.length
        ? product.options.map((option) => ({
            id: option.id,
            name: option.name || "",
            selling_type: option.selling_type || "WEIGHT",
            price: option.price ?? "",
          }))
        : [{ ...EMPTY_OPTION }]
    );
    setModifiers(
      product?.modifiers?.map((modifier) => ({
        id: modifier.id,
        name: modifier.name || "",
        price: modifier.price ?? "",
      })) || []
    );
    setImageFile(null);
    setError("");
  }, [product]);

  // Object URLs are temporary previews for newly selected files.
  // Revoke them when the file changes or the form unmounts.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(imageUrl(product?.image_url));
      return;
    }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile, product?.image_url]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("The image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setError("");
    setImageFile(file);
  };

  const updateOption = (index, field, value) => {
    setOptions((current) => current.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    ));
  };

  const updateModifier = (index, field, value) => {
    setModifiers((current) => current.map((modifier, i) =>
      i === index ? { ...modifier, [field]: value } : modifier
    ));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (!categoryId) return setError("Please select a category.");
    if (!options.length) return setError("At least one selling option is required.");

    for (const option of options) {
      if (!option.name.trim()) return setError("Every selling option needs a name.");
      if (!option.selling_type) return setError("Every selling option needs a selling type.");
      if (option.price === "" || !Number.isFinite(Number(option.price)) || Number(option.price) < 0) {
        return setError("Every selling option needs a valid price.");
      }
    }
    for (const modifier of modifiers) {
      if (!modifier.name.trim()) return setError("Every modifier needs a name.");
      if (modifier.price === "" || !Number.isFinite(Number(modifier.price)) || Number(modifier.price) < 0) {
        return setError("Every modifier needs a valid price.");
      }
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category_id", String(categoryId));
    formData.append("options", JSON.stringify(options.map((option) => ({
      ...(option.id ? { id: option.id } : {}),
      name: option.name.trim(),
      selling_type: option.selling_type,
      price: Number(option.price),
    }))));
    formData.append("modifiers", JSON.stringify(modifiers.map((modifier) => ({
      ...(modifier.id ? { id: modifier.id } : {}),
      name: modifier.name.trim(),
      price: Number(modifier.price),
    }))));
    if (isEditMode) {
      formData.append("active", product.active === undefined || Boolean(product.active) ? "true" : "false");
    }
    if (imageFile) formData.append("image", imageFile);

    try {
      setSaving(true);
      const response = await fetch(
        isEditMode ? `${API_URL}/api/products/${product.id}` : `${API_URL}/api/products`,
        { method: isEditMode ? "PUT" : "POST", body: formData }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || (isEditMode ? "Failed to update product." : "Failed to create product."));
      }
      onSaved();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={isEditMode ? "Edit product" : "Add product"}>
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:max-w-2xl sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditMode ? "Edit Product" : "Add Product"}</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Manage details, image, prices, and options</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close form" className="rounded-lg px-3 py-2 text-2xl text-gray-500 hover:bg-gray-100 disabled:opacity-50">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Name *
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gulab Jamun" className={`mt-1 ${fieldClass}`} required />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Category *
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`mt-1 ${fieldClass}`} required>
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Description
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Optional description" className={`mt-1 resize-none ${fieldClass}`} />
            </label>

            <section className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Product Photo</h3>
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP · Maximum 5 MB</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5EBDD] text-center text-sm text-gray-500">
                  {imagePreview ? <img src={imagePreview} alt={`${name || "Product"} preview`} className="h-full w-full object-cover" /> : <span className="px-3">No photo selected</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <label htmlFor="product-image" className="mb-2 block text-sm font-medium text-gray-700">{imagePreview ? "Change photo" : "Choose photo"}</label>
                  <input id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="block w-full min-w-0 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#8B1E1E] file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-[#721818]" />
                  {imageFile && <p className="mt-2 break-all text-xs text-gray-500">Selected: {imageFile.name}</p>}
                  {imageFile && <button type="button" onClick={() => setImageFile(null)} className="mt-2 text-sm font-medium text-[#8B1E1E] underline">Cancel photo change</button>}
                  {isEditMode && !imageFile && product?.image_url && <p className="mt-2 text-xs text-gray-500">Existing photo will be kept unless you choose a new one.</p>}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Selling Options</h3>
                  <p className="text-xs text-gray-500">How customers can buy this product</p>
                </div>
                <button type="button" onClick={() => setOptions((current) => [...current, { ...EMPTY_OPTION }])} className="rounded-lg border border-[#8B1E1E] px-3 py-2 text-sm font-medium text-[#8B1E1E] hover:bg-red-50">+ Add Option</button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id || `new-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_140px_110px_auto]">
                      <label className="text-xs font-medium text-gray-600">Option name
                        <input type="text" value={option.name} onChange={(e) => updateOption(index, "name", e.target.value)} placeholder="e.g. Per Kg" className={`mt-1 ${fieldClass}`} />
                      </label>
                      <label className="text-xs font-medium text-gray-600">Selling type
                        <select value={option.selling_type} onChange={(e) => updateOption(index, "selling_type", e.target.value)} className={`mt-1 ${fieldClass}`}>
                          {SELLING_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-gray-600">Price (₹)
                        <input type="number" min="0" step="0.01" value={option.price} onChange={(e) => updateOption(index, "price", e.target.value)} placeholder="Price" className={`mt-1 ${fieldClass}`} />
                      </label>
                      <button type="button" onClick={() => setOptions((current) => current.filter((_, i) => i !== index))} disabled={options.length === 1} className="self-end rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Modifiers</h3>
                  <p className="text-xs text-gray-500">Optional extras such as Butter or Pure Ghee</p>
                </div>
                <button type="button" onClick={() => setModifiers((current) => [...current, { name: "", price: "" }])} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">+ Add Modifier</button>
              </div>
              {modifiers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">No modifiers added</div>
              ) : (
                <div className="space-y-3">
                  {modifiers.map((modifier, index) => (
                    <div key={modifier.id || `new-${index}`} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[1fr_140px_auto]">
                      <label className="text-xs font-medium text-gray-600">Modifier name
                        <input type="text" value={modifier.name} onChange={(e) => updateModifier(index, "name", e.target.value)} placeholder="e.g. Butter" className={`mt-1 ${fieldClass}`} />
                      </label>
                      <label className="text-xs font-medium text-gray-600">Price (₹)
                        <input type="number" min="0" step="0.01" value={modifier.price} onChange={(e) => updateModifier(index, "price", e.target.value)} placeholder="Price" className={`mt-1 ${fieldClass}`} />
                      </label>
                      <button type="button" onClick={() => setModifiers((current) => current.filter((_, i) => i !== index))} className="self-end rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
            {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-white px-4 py-4 sm:px-6">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#8B1E1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#721818] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
