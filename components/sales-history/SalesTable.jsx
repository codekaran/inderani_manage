import { formatAmount, formatTime } from "./salesHistoryUtils";

function SalesTable({ sales, onSaleClick }) {
  if (sales.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        No sales found for this date.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Bill
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Time
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Subtotal
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Discount
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Total
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Payment
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {sales.map((sale) => (
            <tr
              key={sale.id}
              onClick={() => onSaleClick(sale.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="px-5 py-4 font-semibold text-gray-900">
                #{sale.bill_number}
              </td>

              <td className="px-5 py-4 text-gray-600">
                {formatTime(sale.created_at)}
              </td>

              <td className="px-5 py-4 text-gray-700">
                {formatAmount(sale.subtotal)}
              </td>

              <td className="px-5 py-4 text-gray-700">
                {formatAmount(sale.discount_amount)}
              </td>

              <td className="px-5 py-4 font-semibold text-gray-900">
                {formatAmount(sale.total_amount)}
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  {sale.payment_method}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;