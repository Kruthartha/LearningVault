import { useState, useEffect, useRef } from "react";
import { Settings, LogOut, HelpCircle } from "lucide-react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

const UserMenu = ({ userData, getInitials }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {getInitials("Kruthartha", "S Gowda")}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {userData.user.first_name}
          </div>
          <div className="text-xs text-gray-500">{` ${userData?.onboarding?.learning_track?.charAt(0).toUpperCase() +
    userData?.onboarding?.learning_track?.slice(1).toLowerCase()} Track`}</div>
        </div>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-2">
          <div className="p-2 border-b border-gray-100">
            <p className="text-sm font-medium text-black">
              {userData.user.first_name} {userData.user.last_name}
            </p>
            <p className="text-xs text-gray-500">{userData.user.email}</p>
          </div>
          {[
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Help Center" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
          <div className="w-full h-px bg-gray-100 my-2"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
