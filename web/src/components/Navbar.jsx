import { NavLink, useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/patient-tracking": "Patient Tracking",
  "/ambulance-dashboard": "Ambulance Dashboard",
  "/hospital-dashboard": "Hospital Dashboard"
};

function Navbar() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "RESQ";
  const navClass = ({ isActive }) =>
    `rounded-lg px-2 py-1 transition-colors ${isActive ? "bg-red-50 text-red-700" : "hover:text-red-700"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-red-600" />
          <div className="leading-tight">
            <p className="text-lg font-black tracking-wide text-red-700">RESQ</p>
            <p className="text-xs text-slate-500">Smart Emergency Response</p>
          </div>
        </div>

        <h1 className="hidden text-sm font-semibold text-slate-700 sm:block md:text-base">
          {pageTitle}
        </h1>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            System Online
          </span>
          <div className="h-9 w-9 rounded-full bg-slate-200" />
        </div>
        </div>

        <nav className="hidden items-center gap-2 border-t border-slate-100 py-2 text-sm font-medium text-slate-600 md:flex">
          <NavLink to="/" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/ambulance-dashboard" className={navClass}>
            Ambulance
          </NavLink>
          <NavLink to="/hospital-dashboard" className={navClass}>
            Hospital
          </NavLink>
          <NavLink to="/patient-tracking" className={navClass}>
            Tracking
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
