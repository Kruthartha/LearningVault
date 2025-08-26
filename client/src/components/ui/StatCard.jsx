import { TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, change, color = "blue" }) => (
  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-3 md:mb-4">
      <div className={`p-2 md:p-3 bg-${color}-50 rounded-xl`}>
        <Icon className={`w-4 h-4 md:w-6 md:h-6 text-${color}-600`} />
      </div>
      {change && (
        <div className="flex items-center text-xs md:text-sm text-green-600">
          <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />+{change}%
        </div>
      )}
    </div>
    <div>
      <div className="text-xl md:text-2xl font-light text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default StatCard;
