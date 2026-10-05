import { useEffect, useMemo, useState } from "react";

import ProductGrid from "./ProductGrid";
import ProductPopup from "./ProductPopup";
import Cart from "./Cart";
import PaymentPopup from "./PaymentPopup";
import SaleSuccess from "./SaleSuccess";


const API_URL = "http://localhost:3000";

function POS() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] =
  useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/categories`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch categories"
        );
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );
    }
  };

  // --------------------------------------------------
  // FILTER PRODUCTS
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category_name ===
          selectedCategory
      );
    }

    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter((product) =>
        product.name
          .toLowerCase()
          .includes(searchText)
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    search,
  ]);

  // --------------------------------------------------
  // MODIFIER COMPARISON
  // --------------------------------------------------

  const areModifiersSame = (
    modifiersA = [],
    modifiersB = []
  ) => {
    if (
      modifiersA.length !==
      modifiersB.length
    ) {
      return false;
    }

    const idsA = modifiersA
      .map((modifier) => modifier.id)
      .sort((a, b) => a - b);

    const idsB = modifiersB
      .map((modifier) => modifier.id)
      .sort((a, b) => a - b);

    return idsA.every(
      (id, index) =>
        id === idsB[index]
    );
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const addToCart = (newItem) => {
    setCart((currentCart) => {

      const existingIndex =
        currentCart.findIndex(
          (item) =>
            item.product_id ===
              newItem.product_id &&
            item.product_option_id ===
              newItem.product_option_id &&
            areModifiersSame(
              item.modifiers,
              newItem.modifiers
            )
        );

      // ----------------------------------------------
      // NEW ITEM
      // ----------------------------------------------

      if (existingIndex === -1) {
        return [
          ...currentCart,
          newItem,
        ];
      }

      // ----------------------------------------------
      // MERGE EXISTING ITEM
      // ----------------------------------------------

      const updatedCart = [
        ...currentCart,
      ];

      const existingItem =
        updatedCart[existingIndex];

      const newQuantity =
        Number(existingItem.quantity) +
        Number(newItem.quantity);

      const newTotal =
        Number(existingItem.total_price) +
        Number(newItem.total_price);

      // ----------------------------------------------
      // WEIGHT
      // ----------------------------------------------

      if (
        existingItem.selling_type ===
        "WEIGHT"
      ) {
        const totalWeightGrams =
          newQuantity * 1000;

        let quantityText;

        if (
          totalWeightGrams >= 1000
        ) {
          const kg =
            totalWeightGrams / 1000;

          quantityText = `${Number.isInteger(
            kg
          )
            ? kg
            : kg.toFixed(3)} kg`;
        } else {
          quantityText = `${totalWeightGrams} g`;
        }

        updatedCart[existingIndex] = {
          ...existingItem,

          quantity: newQuantity,

          total_price: newTotal,

          quantity_text:
            quantityText,
        };

        return updatedCart;
      }

      // ----------------------------------------------
      // PIECE / PLATE / GLASS
      // ----------------------------------------------

      let unitName = "units";

      if (
        existingItem.selling_type ===
        "PIECE"
      ) {
        unitName =
          newQuantity === 1
            ? "pc"
            : "pcs";
      } else if (
        existingItem.selling_type ===
        "PLATE"
      ) {
        unitName =
          newQuantity === 1
            ? "plate"
            : "plates";
      } else if (
        existingItem.selling_type ===
        "GLASS"
      ) {
        unitName =
          newQuantity === 1
            ? "glass"
            : "glasses";
      }

      updatedCart[existingIndex] = {
        ...existingItem,

        quantity: newQuantity,

        total_price: newTotal,

        quantity_text: `${newQuantity} ${unitName}`,
      };

      return updatedCart;
    });
  };

  // --------------------------------------------------
  // REMOVE ITEM
  // --------------------------------------------------

  const removeFromCart = (
    itemToRemove
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.product_id ===
              itemToRemove.product_id &&
            item.product_option_id ===
              itemToRemove.product_option_id &&
            areModifiersSame(
              item.modifiers,
              itemToRemove.modifiers
            )
          )
      )
    );
  };

  // --------------------------------------------------
  // CLEAR CART
  // --------------------------------------------------

  const clearCart = () => {
    if (cart.length === 0) return;

    const confirmed =
      window.confirm(
        "Clear the current bill?"
      );

    if (!confirmed) return;

    setCart([]);
  };

  // --------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.total_price),
      0
    );
  }, [cart]);

  // --------------------------------------------------
  // PAYMENT
  // --------------------------------------------------

 const handlePayment = () => {
  if (cart.length === 0) return;

  setShowPayment(true);
};

const handleCompletePayment = async (paymentData) => {
  try {
    const saleData = {
      employee_id: null,

      items: cart.map((item) => ({
        product_id: item.product_id,
        product_option_id: item.product_option_id,
        product_name: item.product_name,
        quantity: item.quantity,

        modifiers: (item.modifiers || []).map((modifier) => ({
          id: modifier.id,
          name: modifier.name,
          price: modifier.price,
        })),
      })),

      payment: {
        method: paymentData.method,
        amount: paymentData.amount,
        amount_received: paymentData.amount_received,
      },
    };

    const response = await fetch(`${API_URL}/api/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to save sale.");
    }

setShowPayment(false);
setCart([]);
setCompletedSale(data);

  } catch (error) {
    console.error("Payment error:", error);

    alert(`Could not complete payment.\n\n${error.message}`);
  }
};
  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="h-screen overflow-hidden bg-gray-100">

      {/* HEADER */}
      <header className="flex h-20 items-center justify-between bg-white px-6 shadow-sm">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inderani Sweets
          </h1>

          <p className="text-sm text-gray-500">
            POS
          </p>
        </div>

        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-64 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
          />

        </div>

      </header>

      {/* MAIN */}
      <main className="flex h-[calc(100vh-80px)] min-h-0">

        {/* LEFT */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* CATEGORIES */}
          <div className="shrink-0 overflow-x-auto bg-white px-4 py-3">

            <div className="flex gap-2">

              <button
                onClick={() =>
                  setSelectedCategory(
                    "All"
                  )
                }
                className={`whitespace-nowrap rounded-xl px-5 py-3 font-semibold ${
                  selectedCategory ===
                  "All"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        category.name
                      )
                    }
                    className={`whitespace-nowrap rounded-xl px-5 py-3 font-semibold ${
                      selectedCategory ===
                      category.name
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                )
              )}

            </div>

          </div>

          {/* PRODUCT GRID */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">

            <ProductGrid
              products={
                filteredProducts
              }
              loading={loading}
              onProductClick={
                setSelectedProduct
              }
            />

          </div>

        </section>

        {/* CART */}
        <aside className="w-[380px] shrink-0 border-l bg-white">

          <Cart
            cart={cart}
            subtotal={subtotal}
            onRemoveItem={
              removeFromCart
            }
            onClearCart={
              clearCart
            }
            onPayment={
              handlePayment
            }
          />

        </aside>

      </main>

      {/* POPUP */}
      {selectedProduct && (
        <ProductPopup
          product={
            selectedProduct
          }
          onClose={() =>
            setSelectedProduct(
              null
            )
          }
          onAddToCart={
            addToCart
          }
        />
      )}

      {showPayment && (
  <PaymentPopup
    total={subtotal}
    onClose={() =>
      setShowPayment(false)
    }
    onComplete={
      handleCompletePayment
    }
  />
)}
{completedSale && (
  <SaleSuccess
    sale={completedSale}
    onNewBill={() => setCompletedSale(null)}
  />
)}

    </div>
  );
}

export default POS;