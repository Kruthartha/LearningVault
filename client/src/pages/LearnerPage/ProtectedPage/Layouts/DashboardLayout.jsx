import { useState, useRef, useEffect, createContext, Suspense } from "react";
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
import CommandPalette from "../Dashboard/components/CommandPalette";
import UserMenu from "../Dashboard/components/UserMenu";
import Notifications from "../Dashboard/components/NotificationPanel";
import { ThemeToggleButton } from "../Dashboard/Learn/components/ThemeToggleButton";
import { LayoutContext } from "../Context/LayoutContext";

// Import the generic skeleton
import GenericPageSkeleton from "./GenericPageSkeleton";

const getInitials = (first, last) => {
  if (!first) return "?";
  return (first[0] + (last ? last[0] : "")).toUpperCase();
};

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/learn", label: "Learn", icon: BookOpen },
  { path: "/dashboard/practice", label: "Practice", icon: DraftingCompass },
];

// 1. Accept `userProfile` as a prop
const DashboardLayout = ({ userProfile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const notificationRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Set state directly from the prop
  const [userData, setUserData] = useState(userProfile);
  //    Set loading to false if we already have data
  const [loading, setLoading] = useState(!userProfile);

  // 3. The redundant useEffect for fetching the profile has been REMOVED

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); // Also clear the token
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // This hook closes the mobile menu on navigation
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // This hook closes the mobile menu when the path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // This hook handles clicks outside the notification panel
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

  // 4. Update the loading check
  //    This now only shows if the prop wasn't passed for some reason
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <GenericPageSkeleton />
      </main>
    );
  }

  // This is a final fallback check
  if (!userData) return <p>Error: No user data found.</p>;

  return (
    <LayoutContext.Provider value={{ setIsFullScreen }}>
      <div className="min-h-screen bg-neutral-50 dark:bg-[#0d1117]">
        <CommandPalette
          open={isCommandPaletteOpen}
          setOpen={setCommandPaletteOpen}
        />

        {!isFullScreen && (
          <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-[#30363d] dark:bg-[#161b22]/80">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-light text-black dark:text-white md:text-2xl">
                      Learning
                      <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text font-medium text-transparent">
                        Vault
                      </span>
                    </h1>
                  </div>
                  <nav className="hidden items-center gap-2 lg:flex">
                    {navItems.map(({ path, label, icon: Icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        end={path === "/dashboard"}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 dark:bg-[#21262d] dark:text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#21262d] dark:text-gray-400 dark:hover:bg-gray-800 md:flex"
                  >
                    <Search className="h-4 w-4" /> Search...{" "}
                    <span className="rounded-md border border-gray-200 px-1.5 py-0.5 text-xs dark:border-gray-600">
                      ⌘K
                    </span>
                  </button>
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  <Notifications />
                  <ThemeToggleButton />

                  <div className="hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block"></div>
                  {/* 5. Pass the userData (from state/prop) to UserMenu */}
                  <UserMenu userData={userData} getInitials={getInitials} />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-white dark:bg-[#0d1117] lg:hidden"
            aria-modal="true"
          >
            <div className="flex h-full flex-col px-4 pb-8 sm:px-6">
              <div className="mb-6 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-light text-black dark:text-gray-300">
                    Learning
                    <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text font-medium text-transparent">
                      Vault
                    </span>
                  </h1>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-grow flex-col gap-2 overflow-y-auto">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" /> {label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 flex-shrink-0 border-t border-gray-200 pt-6 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main
          className={
            isFullScreen ? "" : "mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8"
          }
        >
          {/* This Suspense wrapper handles the lazy-loading of child routes */}
          <Suspense fallback={<GenericPageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;
