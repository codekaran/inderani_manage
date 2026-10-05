import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

const API_URL = "http://localhost:3000";

function ItemManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productToDisable, setProductToDisable] = useState(null);
  const [disabling, setDisabling] = useState(false);

  // -----------------------------
  // Fetch Products
  // -----------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Fetch Categories
  // -----------------------------
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // -----------------------------
  // Add Product
  // -----------------------------
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  // -----------------------------
  // Edit Product
  // -----------------------------
  const handleEditProduct = async (product) => {
    try {
      const response = await fetch(
        `${API_URL}/api/products/${product.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const fullProduct = await response.json();

      setEditingProduct(fullProduct);
      setShowProductForm(true);
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Could not load product.");
    }
  };

  // -----------------------------
  // Product Saved
  // -----------------------------
  const handleProductSaved = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  // -----------------------------
  // Close Form
  // -----------------------------
  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // -----------------------------
  // Ask Disable Confirmation
  // -----------------------------
  const handleDisableClick = (product) => {
    setProductToDisable(product);
  };

  // -----------------------------
  // Disable Product
  // -----------------------------
  const handleConfirmDisable = async () => {
    if (!productToDisable) return;

    try {
      setDisabling(true);

      const response = await fetch(
        `${API_URL}/api/products/${productToDisable.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to disable product");
      }

      setProductToDisable(null);

      await fetchProducts();
    } catch (error) {
      console.error("Error disabling product:", error);
      alert("Could not disable product.");
    } finally {
      setDisabling(false);
    }
  };

  // -----------------------------
  // Filter Products
  // -----------------------------
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category_name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Item Manager
          </h1>

          <p className="text-sm text-gray-500">
            Manage products, prices and selling options
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white shadow hover:bg-red-800"
        >
          + Add Product
        </button>
      </div>

      {/* Search + Category */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >

              {/* Product Name */}
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {product.category_name}
                </p>
              </div>

              {/* Options */}
              <div className="mb-4 space-y-2">

                {product.options?.map((option) => (

                  <div
                    key={option.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {option.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {option.selling_type}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      ₹{option.price}
                    </p>
                  </div>

                ))}

              </div>

              {/* Modifiers */}
              {product.modifiers?.length > 0 && (
                <div className="mb-4">

                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                    Modifiers
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {product.modifiers.map((modifier) => (

                      <span
                        key={modifier.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                      >
                        {modifier.name} +₹{modifier.price}
                      </span>

                    ))}

                  </div>

                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">

                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDisableClick(product)}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  Disable
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* Product Form */}
      {showProductForm && (
        <ProductForm
          categories={categories}
          product={editingProduct}
          onClose={handleCloseForm}
          onSaved={handleProductSaved}
        />
      )}

      {/* Disable Confirmation Modal */}
      {productToDisable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold text-gray-800">
              Disable Product?
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to disable{" "}
              <span className="font-semibold text-gray-800">
                {productToDisable.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-gray-500">
              The product will no longer appear in the active product list.
              Its database record will be preserved.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setProductToDisable(null)}
                disabled={disabling}
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDisable}
                disabled={disabling}
                className="rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-50"
              >
                {disabling ? "Disabling..." : "Disable Product"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ItemManager;