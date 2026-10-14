
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { label: "POS Billing", path: "/", icon: "▦" },
  { label: "Orders", path: "/orders", icon: "▤" },
  { label: "Item Manager", path: "/items", icon: "▧" },
  { label: "Sales History", path: "/sales-history", icon: "◷" },
];

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    navigation.find((item) => item.path === location.pathname);

  const pageTitle = currentPage?.label || "Dashboard";

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FFF8EE]">

      {/* SHARED HEADER */}
      <header className="relative z-30 flex min-h-[76px] shrink-0 items-center gap-3 border-b border-[#E8DCCB] bg-white px-4 shadow-sm sm:px-6">

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E8DCCB] text-2xl text-[#8B1E1E] transition hover:bg-[#FFF8EE] active:scale-95"
        >
          {menuOpen ? "×" : "☰"}
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-extrabold text-[#8B1E1E] sm:text-xl">
            Inderani Sweets
          </h1>
          <p className="truncate text-xs text-gray-500">
            {pageTitle} · Management System
          </p>
        </div>

      </header>

      {/* DRAWER AND PAGE CONTENT */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">

        {menuOpen && (
          <div className="fixed inset-0 z-40">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            {/* Drawer */}
            <nav
              aria-label="Main navigation"
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
            >
              <div className="border-b border-[#E8DCCB] bg-[#FFF8EE] p-5">
                <h2 className="text-xl font-extrabold text-[#8B1E1E]">
                  Inderani Sweets
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Traditional sweets since 1947
                </p>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {navigation.map((item) => {
                  const active = location.pathname === item.path;

                  return (
                    <button
                      type="button"
                      key={item.path}
                      onClick={() => goTo(item.path)}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-semibold transition ${
                        active
                          ? "bg-[#8B1E1E] text-white"
                          : "text-gray-700 hover:bg-[#FFF8EE] hover:text-[#8B1E1E]"
                      }`}
                    >
                      <span className="w-6 text-center text-lg">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 p-4">
                <p className="text-xs text-gray-400">
                  Inderani Sweets · POS
                </p>
              </div>
            </nav>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AppLayout;
