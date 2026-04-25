function BottomActionPanel({ pendingAlerts, emergency, busy, onDispatch }) {
  const canDispatch = pendingAlerts > 0 && !busy;

  return (
    <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="rounded-full bg-red-100 px-2 py-1 font-semibold text-red-700">
            Pending Alerts: {pendingAlerts}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
            Status: {emergency?.emergencyStatus || "idle"}
          </span>
        </div>

        <button
          type="button"
          disabled={!canDispatch}
          onClick={onDispatch}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Dispatch Ambulance
        </button>
      </div>
    </div>
  );
}

export default BottomActionPanel;
