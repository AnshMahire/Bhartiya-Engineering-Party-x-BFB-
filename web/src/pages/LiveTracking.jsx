import MapView from "../components/MapView";
import StatusCard from "../components/StatusCard";

function LiveTracking({ emergency }) {
  return (
    <section className="space-y-3">
      <StatusCard
        title="Tracking View"
        value="Live Positioning"
        subtitle="Map markers update from backend tracking state"
        tone="info"
      />
      <MapView emergency={emergency} />
    </section>
  );
}

export default LiveTracking;
