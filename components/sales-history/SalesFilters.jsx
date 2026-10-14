function SalesFilters({
  selectedDate,
  setSelectedDate,
  search,
  setSearch,
  onSearch,
  onRefresh,
}) {
  return (
    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        {/* Bill Search */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Bill Number
          </label>

          <input
            type="text"
            placeholder="Search bill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-48 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        {/* Search */}
        <button
          onClick={onSearch}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default SalesFilters;