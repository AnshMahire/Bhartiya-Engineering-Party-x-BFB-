import L from "leaflet";

function createMarkerIcon(symbol, background) {
  return L.divIcon({
    className: "custom-map-marker",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:${background};border:2px solid #ffffff;box-shadow:0 2px 8px rgba(15,23,42,0.25);font-size:18px;line-height:1;">${symbol}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14]
  });
}

export const patientIcon = createMarkerIcon("🧑", "#0ea5e9");
export const ambulanceIcon = createMarkerIcon("🚑", "#ef4444");
export const hospitalIcon = createMarkerIcon("🏥", "#16a34a");
