const API_URL = "http://localhost:3000";

export const printHistoricalSale = async (sale, type) => {
  const payment = sale.payments?.[0] || {};

  const printData = {
    type,
    bill_number: sale.bill_number,
    sale_date: sale.created_at,
    items: sale.items.map((item) => ({
      product_name: item.product_name,
      option_name: item.option_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      modifiers: item.modifiers || [],
    })),
    subtotal: sale.subtotal,
    discount_amount: sale.discount_amount,
    total_amount: sale.total_amount,
    payment: {
      method: payment.method || "",
      amount: payment.amount || sale.total_amount,
      amount_received:
        payment.amount_received ?? sale.total_amount,
      change_amount: payment.change_amount ?? 0,
    },
  };

  const response = await fetch(`${API_URL}/api/sales/print`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(printData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Printing failed.");
  }

  return data;
};