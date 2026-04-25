function Sidebar({ activeTab, onChange }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "requests", label: "Requests" },
    { key: "beds", label: "Beds" },
    { key: "analytics", label: "Analytics" },
    { key: "settings", label: "Settings" }
  ];

  return (
    <aside className="rounded-2xl bg-white p-3 shadow-sm">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Hospital Panel</p>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = item.key === activeTab;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active ? "bg-red-100 text-red-500" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              {active ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
