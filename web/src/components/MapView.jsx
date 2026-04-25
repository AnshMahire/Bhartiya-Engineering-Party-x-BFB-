import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapView({ emergency }) {
  if (!emergency) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-500">
        Trigger an emergency to start live map tracking.
      </div>
    );
  }

  const patientPosition = [emergency.patient.lat, emergency.patient.lng];
  const ambulancePosition = [emergency.ambulance.lat, emergency.ambulance.lng];
  const hospitalPosition = [emergency.hospital.lat, emergency.hospital.lng];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer center={patientPosition} zoom={13} className="h-[420px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={patientPosition}>
          <Popup>Patient Location</Popup>
        </Marker>
        <Marker position={ambulancePosition}>
          <Popup>Ambulance: {emergency.ambulance.id}</Popup>
        </Marker>
        <Marker position={hospitalPosition}>
          <Popup>Hospital: {emergency.hospital.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
