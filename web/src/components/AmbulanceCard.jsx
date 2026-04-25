function AmbulanceCard({ ambulance }) {
  if (!ambulance) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Assigned Ambulance</h3>
        <p className="mt-2 text-sm text-slate-500">No assignment yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Assigned Ambulance</h3>
      <div className="mt-3 space-y-1 text-sm text-slate-700">
        <p>
          <span className="font-medium">Ambulance ID:</span> {ambulance.id}
        </p>
        <p>
          <span className="font-medium">Driver:</span> {ambulance.driverName}
        </p>
        <p>
          <span className="font-medium">Live Position:</span> {ambulance.lat}, {ambulance.lng}
        </p>
      </div>
    </div>
  );
}

export default AmbulanceCard;
