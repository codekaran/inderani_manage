
import { NavLink } from "react-router-dom";
import navigation from "./navigation";

function Sidebar({ mobileOpen, onClose }) {
  const renderLinks = (isMobile = false) =>
    navigation.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/"}
        onClick={isMobile ? onClose : undefined}
        title={item.label}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-xl px-3 py-3
          transition-colors ${
            isActive
              ? "bg-[#8B1E1E] text-white shadow-sm"
              : "text-gray-600 hover:bg-[#F3E7D8] hover:text-[#8B1E1E]"
          }`
        }
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center text-xl">
          {item.icon}
        </span>

        <span className={isMobile ? "block" : "hidden lg:block"}>
          {item.label}
        </span>
      </NavLink>
    ));

  return (
    <>
      {/* Desktop and tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20
        flex-col border-r border-[#E8DCCB] bg-[#FFF8EE]
        px-3 py-5 md:flex lg:w-64 lg:px-4">

        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl bg-[#8B1E1E] text-xl
            font-bold text-white">
            I
          </div>

          <div className="hidden min-w-0 lg:block">
            <h1 className="font-bold tracking-wide text-[#2C2C2C]">
              INDERANI
            </h1>
            <p className="text-xs tracking-wider text-[#8B1E1E]">
              SWEETS · 1947
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {renderLinks()}
        </nav>

        <div className="mt-4 border-t border-[#E8DCCB] pt-4
          text-center text-xs text-gray-500">
          <span className="hidden lg:inline">
            Inderani Sweets · Since 1947
          </span>
          <span className="lg:hidden">1947</span>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72
          flex-col bg-[#FFF8EE] px-4 py-5 shadow-xl
          transition-transform duration-200 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Mobile navigation"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center
              rounded-xl bg-[#8B1E1E] text-xl font-bold text-white">
              I
            </div>
            <div>
              <h1 className="font-bold text-[#2C2C2C]">INDERANI</h1>
              <p className="text-xs text-[#8B1E1E]">SWEETS · 1947</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg px-3 py-2 text-xl hover:bg-[#F3E7D8]"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {renderLinks(true)}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
