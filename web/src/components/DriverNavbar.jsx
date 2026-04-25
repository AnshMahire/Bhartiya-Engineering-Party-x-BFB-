function DriverNavbar({ driverName }) {
  return (
    <header className="border-b border-red-100 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-red-600" />
          <div>
            <p className="text-xl font-black tracking-wide text-red-700">RESQ</p>
            <p className="text-xs text-slate-500">Ambulance Command</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Online
          </span>
          <div className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3">
            <div className="h-6 w-6 rounded-full bg-slate-300" />
            <span className="text-sm font-medium text-slate-700">{driverName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DriverNavbar;
