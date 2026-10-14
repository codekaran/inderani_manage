import { formatAmount } from "./salesHistoryUtils";

function SalesSummary({ sales }) {
  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const totalDiscount = sales.reduce(
    (sum, sale) => sum + Number(sale.discount_amount || 0),
    0
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Bills */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Bills</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {sales.length}
        </p>
      </div>

      {/* Total Sales */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Sales</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatAmount(totalSales)}
        </p>
      </div>

      {/* Discounts */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Discounts</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatAmount(totalDiscount)}
        </p>
      </div>
    </div>
  );
}

export default SalesSummary;