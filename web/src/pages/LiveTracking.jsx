import MapView from "../components/MapView";

function LiveTracking({ emergency }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Live Tracking</h2>
      <MapView emergency={emergency} />
    </section>
  );
}

export default LiveTracking;
