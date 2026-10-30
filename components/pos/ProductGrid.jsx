
import { useState } from "react";

const API_URL = "http://localhost:3000";

function getImageUrl(product) {
  const image =
    product.image_url || product.image || product.image_path || "";

  if (!image) return "";
  return image.startsWith("http") ? image : `${API_URL}${image}`;
}

function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-amber-100 bg-white"
          >
            <div className="aspect-square bg-amber-50" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-white p-10 text-center">
        <div className="text-4xl">🍬</div>
        <p className="mt-3 font-semibold text-gray-800">
          No products found
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Try another category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getImageUrl(product);

  const prices = (product.options || [])
    .map((option) => Number(option.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  const lowestPrice = prices.length ? Math.min(...prices) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select ${product.name}`}
      className="group min-w-0 overflow-hidden rounded-2xl border border-amber-100 bg-white text-left shadow-sm transition duration-150 hover:border-amber-300 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800"
    >
      <div className="relative aspect-square overflow-hidden bg-[#FFF8EE]">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-red-900">
            <span className="text-4xl" aria-hidden="true">
              🍬
            </span>
            <span className="text-xs text-gray-500">
              Add product photo
            </span>
          </div>
        )}

        {lowestPrice !== null && (
          <span className="absolute bottom-2 right-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-sm font-bold text-[#8B1E1E] shadow-sm">
            ₹{lowestPrice}
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-800 sm:text-base">
          {product.name}
        </p>

        {product.category_name && (
          <p className="mt-1 truncate text-xs text-gray-500">
            {product.category_name}
          </p>
        )}

        <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-[#8B1E1E] px-2 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#701717]">
          <span>Select item</span>
          <span aria-hidden="true">+</span>
        </div>
      </div>
    </button>
  );
}

export default ProductGrid;
