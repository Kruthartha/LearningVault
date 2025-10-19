import { useState, useEffect, useRef } from "react";
import { Settings, LogOut, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ userData, getInitials }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data and navigate to login
    localStorage.removeItem("accessToken"); // Assuming you store the token here
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Conditional rendering to prevent errors if userData is not yet loaded
  if (!userData?.user || !userData?.onboarding) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Main button to toggle the menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {/* User Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-sm font-medium text-white">
          {getInitials(userData.user.first_name, userData.user.last_name)}
        </div>
        {/* User Name and Track */}
        <div className="hidden text-left sm:block">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
            {userData.user.first_name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {`${
              userData.onboarding.track_name.charAt(0).toUpperCase() +
              userData.onboarding.track_name.slice(1)
            } Track`}
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
          {/* User Info Section */}
          <div className="border-b border-gray-100 p-2 dark:border-gray-800">
            <p className="text-sm font-medium text-black dark:text-white">
              {userData.user.first_name} {userData.user.last_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userData.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="my-2">
            {[
              { icon: Settings, label: "Settings" },
              { icon: HelpCircle, label: "Help Center" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-md p-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-2 h-px w-full bg-gray-100 dark:bg-gray-800"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md p-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;