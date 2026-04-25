import Card from "./Card";

function StatCard({ title, value, trend, trendTone = "blue", icon }) {
  const toneStyles = {
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-600",
    blue: "text-blue-500",
    gray: "text-gray-500"
  };

  return (
    <Card className="border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {icon ? <div className="rounded-xl bg-gray-50 p-2">{icon}</div> : null}
      </div>
      {trend ? <p className={`mt-2 text-xs font-medium ${toneStyles[trendTone] || toneStyles.gray}`}>{trend}</p> : null}
    </Card>
  );
}

export default StatCard;
