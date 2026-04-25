function AmbulanceCard({ ambulance }) {
  return (
    <div className="rounded border bg-white p-3 text-sm">
      <p><span className="font-semibold">Ambulance:</span> {ambulance?.id || "-"}</p>
      <p><span className="font-semibold">Driver:</span> {ambulance?.driverName || "-"}</p>
      <p><span className="font-semibold">Status:</span> {ambulance?.status || "idle"}</p>
    </div>
  );
}

export default AmbulanceCard;
