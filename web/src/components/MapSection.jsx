import L from "leaflet";
import { MapContainer as LeafletMapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapContainer from "./MapContainer";
import { ambulanceIcon, hospitalIcon, patientIcon } from "./mapIcons";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function getNearbyMarkers(emergency) {
  if (!emergency?.requestId) {
    return [];
  }

  return [
    { id: "NE-1", lat: emergency.patient.lat + 0.004, lng: emergency.patient.lng + 0.003 },
    { id: "NE-2", lat: emergency.patient.lat - 0.0035, lng: emergency.patient.lng + 0.0025 }
  ];
}

function MapSection({ emergency }) {
  if (!emergency?.requestId) {
    return (
      <MapContainer title="Driver Map" subtitle="Route and nearby emergency markers">
        <div className="flex h-[66vh] min-h-[430px] items-center justify-center text-slate-500">
          No active emergency. Waiting for incoming request.
        </div>
      </MapContainer>
    );
  }

  const patient = [emergency.patient.lat, emergency.patient.lng];
  const ambulance = [emergency.ambulance.lat, emergency.ambulance.lng];
  const hospital = [emergency.hospital.lat, emergency.hospital.lng];
  const nearby = getNearbyMarkers(emergency);

  const routePoints =
    emergency.phase === "to_hospital"
      ? [ambulance, hospital]
      : [ambulance, patient];

  return (
    <MapContainer
      title="Driver Map"
      subtitle={emergency.phase === "to_hospital" ? "Route to hospital" : "Route to patient"}
      overlay={<span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">Navigation</span>}
    >
      <LeafletMapContainer center={ambulance} zoom={13} className="h-[66vh] min-h-[430px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline positions={routePoints} pathOptions={{ color: "#dc2626", weight: 5 }} />

        <Marker position={ambulance} icon={ambulanceIcon}>
          <Popup>Ambulance: {emergency.ambulance.id}</Popup>
        </Marker>
        <Marker position={patient} icon={patientIcon}>
          <Popup>Patient: {emergency.patient.name}</Popup>
        </Marker>
        <Marker position={hospital} icon={hospitalIcon}>
          <Popup>Hospital: {emergency.hospital.name}</Popup>
        </Marker>

        {nearby.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>Nearby emergency marker</Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </MapContainer>
  );
}

export default MapSection;
