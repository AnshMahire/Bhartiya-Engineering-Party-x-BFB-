function StatusPanel({ statusKey, statusMessage }) {
  return (
    <div className="rounded border bg-white p-3 text-sm">
      <p><span className="font-semibold">{statusKey}:</span> {statusMessage}</p>
    </div>
  );
}

export default StatusPanel;
