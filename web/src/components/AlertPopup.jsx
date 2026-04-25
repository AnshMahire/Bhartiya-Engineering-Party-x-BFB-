import ActionButton from "./ActionButton";

function AlertPopup({ open, title, description, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel", busy }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-4 flex gap-2">
          <ActionButton variant="primary" onClick={onConfirm} disabled={busy} className="flex-1">
            {confirmLabel}
          </ActionButton>
          <ActionButton variant="ghost" onClick={onCancel} disabled={busy} className="flex-1">
            {cancelLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
