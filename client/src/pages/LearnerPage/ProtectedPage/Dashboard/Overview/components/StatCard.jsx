const StatCard = ({ icon: Icon, value, label, colorClass }) => {
  const colors = {
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
    green: { bg: "bg-green-50", text: "text-green-600" },
  };
  const color = colors[colorClass] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg}`}
      >
        <Icon className={`w-6 h-6 ${color.text}`} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;