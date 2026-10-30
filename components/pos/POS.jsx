import { useEffect, useMemo, useState } from "react";

import ProductGrid from "./ProductGrid";
import ProductPopup from "./ProductPopup";
import Cart from "./Cart";
import PaymentPopup from "./PaymentPopup";
import SaleSuccess from "./SaleSuccess";
import DiscountPopup from "./DiscountPopup";

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
  const [printing, setPrinting] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
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

  const discountAmount = discount
  ? discount.type === "AMOUNT"
    ? Math.min(
        Number(discount.value) || 0,
        subtotal
      )
    : Math.min(
        (subtotal *
          (Number(discount.value) || 0)) /
          100,
        subtotal
      )
  : 0;

const total = subtotal - discountAmount;

  // --------------------------------------------------
  // PAYMENT
  // --------------------------------------------------

 const handlePayment = () => {
  if (cart.length === 0) return;

  setShowPayment(true);
};

const handleRemoveItem = (itemToRemove) => {
  setCart((currentCart) =>
    currentCart.filter(
      (item) =>
        !(
          item.product_id === itemToRemove.product_id &&
          item.product_option_id === itemToRemove.product_option_id &&
          JSON.stringify(
            (item.modifiers || []).map((m) => m.id).sort()
          ) ===
            JSON.stringify(
              (itemToRemove.modifiers || []).map((m) => m.id).sort()
            )
        )
    )
  );
};

const handleClearCart = () => {
  setCart([]);
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
discount: discount
  ? {
      type: discount.type,
      value: discount.value,
      reason: discount.reason,
    }
  : null,
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
setCompletedSale({
  ...data,
  items: cart,
});

  } catch (error) {
    console.error("Payment error:", error);

    alert(`Could not complete payment.\n\n${error.message}`);
  }
};

const handlePrintSale = async (type) => {
  if (!completedSale) return;

  try {
    setPrinting(true);

    const printData = {
      type,

      bill_number: completedSale.bill_number,

      items: completedSale.items,

      subtotal: completedSale.subtotal,

      discount_amount:
        completedSale.discount_amount || 0,

      total_amount: completedSale.total_amount,

      payment: completedSale.payment,
    };

    console.log("Sending print request:", printData);

    const response = await fetch(
      `${API_URL}/api/sales/print`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(printData),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Printing failed."
      );
    }

    console.log("Print successful:", data);

  } catch (error) {
    console.error("Print error:", error);

    alert(
      `Could not print.\n\n${error.message}`
    );
  } finally {
    setPrinting(false);
  }
};
 
  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F7F5F0] text-gray-900">

      {/* TOP HEADER */}
      
{/* NAVIGATION DRAWER */}
{showMenu && (
  <div className="fixed inset-0 z-40">

    {/* Backdrop */}
    <button
      type="button"
      aria-label="Close navigation menu"
      onClick={() => setShowMenu(false)}
      className="absolute inset-0 bg-black/40"
    />

    {/* Drawer */}
    <nav className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl">

      <div className="border-b border-amber-100 bg-[#FFF8EE] p-5">
        <h2 className="text-xl font-extrabold text-[#8B1E1E]">
          Inderani Sweets
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Since 1947 · Shop Management
        </p>
      </div>

      <div className="flex-1 space-y-2 p-3">

        <button
          type="button"
          onClick={() => setShowMenu(false)}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-[#8B1E1E] px-4 text-left font-semibold text-white"
        >
          <span>▦</span>
          Point of Sale
        </button>

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            window.location.href = "/orders";
          }}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-medium text-gray-700 hover:bg-amber-50"
        >
          <span>▤</span>
          Orders
        </button>

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            window.location.href = "/sales-history";
          }}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-medium text-gray-700 hover:bg-amber-50"
        >
          <span>◷</span>
          Sales History
        </button>

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            window.location.href = "/items";
          }}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-medium text-gray-700 hover:bg-amber-50"
        >
          <span>▧</span>
          Item Manager
        </button>

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            window.location.href = "/rates";
          }}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-medium text-gray-700 hover:bg-amber-50"
        >
          <span>₹</span>
          Rates
        </button>

      </div>

      <div className="border-t border-gray-100 p-4">
        <p className="text-xs text-gray-400">
          Inderani · POS
        </p>
      </div>

    </nav>
  </div>
)}


      {/* MAIN BILLING AREA */}
      <main className="flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">

        {/* LEFT: PRODUCT BROWSING */}
        <section className="flex min-w-0 flex-1 flex-col">
            
{/* PRODUCT SEARCH */}
<div className="shrink-0 border-b border-amber-100 bg-white p-3 sm:px-4">
  <div className="relative">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      ⌕
    </span>

    <input
      type="text"
      placeholder="Search sweets, snacks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="h-11 w-full rounded-xl border border-gray-200 bg-[#FAFAF9] pl-10 pr-4 text-base outline-none focus:border-[#8B1E1E] focus:ring-2 focus:ring-red-100"
    />
  </div>
</div>

          {/* CATEGORY BAR */}
          <div className="shrink-0 border-b border-amber-100 bg-white px-3 py-3 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`min-h-11 shrink-0 rounded-xl px-5 text-sm font-bold transition active:scale-95 ${
                  selectedCategory === "All"
                    ? "bg-[#8B1E1E] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-amber-50"
                }`}
              >
                All Products
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition active:scale-95 ${
                    selectedCategory === category.name
                      ? "bg-[#8B1E1E] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT RESULTS */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-700 sm:text-base">
                {selectedCategory === "All"
                  ? "All Products"
                  : selectedCategory}
              </h2>

              <span className="shrink-0 text-xs font-medium text-gray-500">
                {filteredProducts.length} products
              </span>
            </div>

            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onProductClick={setSelectedProduct}
            />
          </div>
        </section>

        {/* RIGHT: FIXED-WIDTH BILL PANEL */}
        <aside className="flex h-full min-h-0 w-[320px] shrink-0 flex-col overflow-hidden border-l border-amber-100 bg-white lg:w-[360px] 2xl:w-[400px]">
          <Cart
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discount={discount}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onPayment={handlePayment}
            onDiscount={() => setShowDiscount(true)}
          />
        </aside>
      </main>

      {/* PRODUCT OPTIONS POPUP */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* PAYMENT POPUP */}
      {showPayment && (
        <PaymentPopup
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handleCompletePayment}
        />
      )}

      {/* DISCOUNT POPUP */}
      {showDiscount && (
        <DiscountPopup
          subtotal={subtotal}
          onClose={() => setShowDiscount(false)}
          onApply={(discountData) => {
            setDiscount(discountData);
            setShowDiscount(false);
          }}
        />
      )}

      {/* SALE SUCCESS AND PRINTING */}
      {completedSale && (
  <SaleSuccess
    sale={completedSale}
    onPrintTokenAndBill={() => handlePrintSale("TOKEN_AND_BILL")}
    onPrintBill={() => handlePrintSale("BILL_ONLY")}
    onPrintToken={() => handlePrintSale("TOKEN_ONLY")}
    onFinishWithoutPrinting={() => {
      setCompletedSale(null);
      setDiscount(null);
      setCart([]);
    }}
    onNewBill={() => {
      setCompletedSale(null);
      setDiscount(null);
      setCart([]);
    }}
    printing={printing}
  />
)}
    </div>
  );
}

export default POS;
