import ReactDOM from "react-dom";
import { useState, useRef, useEffect, createContext } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  DraftingCompass,
  LayoutDashboard,
  Sprout,
  LogOut,
} from "lucide-react";
import CommandPalette from "../../components/ui/CommandPalette";
import UserMenu from "../../components/ui/UserMenu";
import Notifications from "./NotificationPanel";

import { LayoutContext } from "../../context/LayoutContext";

const API_URL = import.meta.env.VITE_API_URL;

const getInitials = (first, last) => {
  if (!first) return "?";
  return (first[0] + (last ? last[0] : "")).toUpperCase();
};

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/practice", label: "Practice", icon: DraftingCompass },
  { path: "/community", label: "Community", icon: Users },
  { path: "/jobs", label: "Opportunities", icon: Sprout },
];

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const notificationRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- API call removed, using a static user object instead ---

//   const userData = {
//     ok: true,
//     user: {
//       id: 3,
//       first_name: "Kruthartha",
//       last_name: "S Gowda",
//       email: "krutharthasgowda@gmail.com",
//     },
//     onboarding_completed: true,
//     onboarding: {
//       id: 1,
//       user_id: 3,
//       learning_goals: '{"hobby"}',
//       coding_experience: "Advanced",
//       learning_track: "fullstack",
//       onboarding_completed: true,
//       created_at: "2025-09-03T14:43:07.241Z",
//       updated_at: "2025-09-03T14:43:07.241Z",
//     },
//   };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await res.json();
        console.log("Profile API:", data);

        if (data.ok) {
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      message: "New badge!",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      type: "reminder",
      message: "Assignment due",
      time: "4h ago",
      unread: true,
    },
  ]);

  const handleLogout = () => {
    // In a real app, you would clear auth tokens here.
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Effect to handle body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Effect to close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Effect to handle clicks outside the notification panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !notificationRef.current.querySelector("button")?.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  if (!userData) return <p>Failed to load user profile.</p>;

  return (
    <LayoutContext.Provider value={{ setIsFullScreen }}>
      <div className="min-h-screen bg-white">
        <CommandPalette
          open={isCommandPaletteOpen}
          setOpen={setCommandPaletteOpen}
        />

        {!isFullScreen && (
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-light text-black">
                      Learning
                      <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                        Vault
                      </span>
                    </h1>
                  </div>
                  <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        end={path === "/dashboard"}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" /> {label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-4 h-4" /> Search...{" "}
                    <span className="text-xs border border-gray-200 rounded-md px-1.5 py-0.5">
                      ⌘K
                    </span>
                  </button>
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <Notifications />

                  <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                  <UserMenu userData={userData} getInitials={getInitials} />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-white lg:hidden"
            aria-modal="true"
          >
            <div className="flex flex-col h-full px-4 sm:px-6 pb-8">
              <div className="flex-shrink-0 flex items-center justify-between h-16 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-light text-black">
                    Learning
                    <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                      Vault
                    </span>
                  </h1>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-grow flex flex-col gap-2 overflow-y-auto">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" /> {label}
                  </NavLink>
                ))}
              </nav>

              <div className="flex-shrink-0 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main
          className={
            isFullScreen ? "" : "max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8"
          }
        >
          <Outlet />
        </main>
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;
