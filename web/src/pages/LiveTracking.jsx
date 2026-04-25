import MapView from "../components/MapView";

function LiveTracking({ emergency }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">Live Tracking</h2>
      <MapView emergency={emergency} />
    </section>
  );
}

export default LiveTracking;
