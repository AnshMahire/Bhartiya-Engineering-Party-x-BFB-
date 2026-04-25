import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientTracking from "./pages/PatientTracking";
import AmbulanceDashboard from "./pages/AmbulanceDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <nav className="border-b bg-white px-4 py-3">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-4 text-sm font-medium">
            <NavLink to="/" className="hover:text-blue-600">Dashboard</NavLink>
            <NavLink to="/patient-tracking" className="hover:text-blue-600">Patient Tracking</NavLink>
            <NavLink to="/ambulance-dashboard" className="hover:text-blue-600">Ambulance Dashboard</NavLink>
            <NavLink to="/hospital-dashboard" className="hover:text-blue-600">Hospital Dashboard</NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient-tracking" element={<PatientTracking />} />
          <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
