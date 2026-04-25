import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientTracking from "./pages/PatientTracking";
import AmbulanceDashboard from "./pages/AmbulanceDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient-tracking" element={<PatientTracking />} />
          <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
