import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-red-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xl font-black tracking-wide text-red-700">RESQ</p>
            <p className="mt-2 text-sm text-slate-600">
              Saving lives through smart coordination
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Quick Links
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <NavLink to="/" className="text-slate-600 hover:text-red-700">
                Dashboard
              </NavLink>
              <NavLink to="/ambulance-dashboard" className="text-slate-600 hover:text-red-700">
                Ambulance
              </NavLink>
              <NavLink to="/hospital-dashboard" className="text-slate-600 hover:text-red-700">
                Hospital
              </NavLink>
              <NavLink to="/patient-tracking" className="text-slate-600 hover:text-red-700">
                Tracking
              </NavLink>
            </div>
          </div>

          <div className="text-sm text-slate-500 sm:text-right lg:text-left">
            <p>&copy; {new Date().getFullYear()} RESQ</p>
            <p>Emergency Coordination Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
