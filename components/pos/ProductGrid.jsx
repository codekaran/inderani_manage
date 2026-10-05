function ProductGrid({
  products,
  loading,
  onProductClick,
}) {
  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  // --------------------------------
  // Empty
  // --------------------------------

  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  // --------------------------------
  // Products
  // --------------------------------

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">

      {products.map((product) => {

        const prices =
          product.options?.map((option) =>
            Number(option.price)
          ) || [];

        const lowestPrice =
          prices.length > 0
            ? Math.min(...prices)
            : null;

        return (

          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="min-h-[110px] rounded-xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >

            <p className="font-semibold text-gray-800">
              {product.name}
            </p>

            {lowestPrice !== null && (

              <p className="mt-2 text-sm text-gray-500">
                From ₹{lowestPrice}
              </p>

            )}

          </button>

        );
      })}

    </div>
  );
}

export default ProductGrid;