import { useEffect, useState } from "react";

import SalesFilters from "./SalesFilters";
import SalesSummary from "./SalesSummary";
import SalesTable from "./SalesTable";
import SaleDetailsPopup from "./SalesDetailPopup";

const API_URL = "http://192.168.1.9:3000";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  });

  const [search, setSearch] = useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (selectedDate) {
        params.append("date", selectedDate);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${API_URL}/api/sales?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load sales."
        );
      }

      setSales(data.sales || []);
    } catch (error) {
      console.error("Sales history error:", error);

      setError(
        error.message || "Failed to load sales."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [selectedDate]);

const handleSaleClick = async (saleId) => {
  try {
    setLoadingDetails(true);
    setSelectedSale(null);

    const response = await fetch(
      `${API_URL}/api/sales/${saleId}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load bill details."
      );
    }

    setSelectedSale(data.sale);
  } catch (error) {
    console.error("Bill details error:", error);

    alert(
      error.message || "Failed to load bill details."
    );
  } finally {
    setLoadingDetails(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sales History
          </h1>

          <p className="text-sm text-gray-500">
            View completed sales and bills
          </p>
        </div>
      </div>

      {/* Filters */}
      <SalesFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        search={search}
        setSearch={setSearch}
        onSearch={fetchSales}
        onRefresh={fetchSales}
      />

      {/* Summary */}
      <SalesSummary sales={sales} />

      {/* Sales Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading sales...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-600">
            {error}
          </div>
        ) : (
          <SalesTable
            sales={sales}
            onSaleClick={handleSaleClick}
          />
        )}
      </div>
      <SaleDetailsPopup
  sale={selectedSale}
  loading={loadingDetails}
  onClose={() => {
    setSelectedSale(null);
    setLoadingDetails(false);
  }}
/>
    </div>
  );
}

export default SalesHistory;