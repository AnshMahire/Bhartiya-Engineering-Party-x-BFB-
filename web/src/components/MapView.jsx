import L from "leaflet";
import { MapContainer as LeafletMapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapContainer from "./MapContainer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapView({ emergency }) {
  if (!emergency?.requestId) {
    return (
      <MapContainer title="Live Map" subtitle="Patient, ambulance and hospital positions">
        <div className="flex h-[360px] items-center justify-center text-sm text-slate-500">
          No active emergency to track
        </div>
      </MapContainer>
    );
  }

  const patientPosition = [emergency.patient.lat, emergency.patient.lng];
  const ambulancePosition = [emergency.ambulance.lat, emergency.ambulance.lng];
  const hospitalPosition = [emergency.hospital.lat, emergency.hospital.lng];

  return (
    <MapContainer
      title="Live Map"
      subtitle="Patient, ambulance and hospital positions"
      overlay={<span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">Tracking</span>}
    >
      <LeafletMapContainer center={patientPosition} zoom={13} className="h-[360px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={patientPosition}>
          <Popup>Patient</Popup>
        </Marker>

        <Marker position={ambulancePosition}>
          <Popup>Ambulance: {emergency.ambulance.id}</Popup>
        </Marker>

        <Marker position={hospitalPosition}>
          <Popup>Hospital: {emergency.hospital.name}</Popup>
        </Marker>
      </LeafletMapContainer>
    </MapContainer>
  );
}

export default MapView;
