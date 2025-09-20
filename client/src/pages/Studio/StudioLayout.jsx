import { useState, useEffect, createContext, useContext } from "react";
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  BookText,
  Menu,
  Search,
  LogOut,
  Indent,
  Outdent,
  Bell,
  Settings,
  GraduationCap,
  Library,
  GitMerge,
  Puzzle,
  Newspaper,
  FileText,
} from "lucide-react";

// --- START: Placeholder Components (As provided) ---
const CommandPalette = ({ open, setOpen }) => {
  /* ... placeholder code ... */
};
const Notifications = () => (
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
    <Bell className="w-5 h-5" />
  </button>
);
export const LayoutContext = createContext({
  isFullScreen: false,
  setIsFullScreen: () => {},
});
// --- END: Placeholder Components ---

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const getInitials = (first, last) => {
  if (!first) return "?";
  return (first[0] + (last ? last[0] : "")).toUpperCase();
};
const navItems = [
  { path: "/studio/", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Content",
    icon: FolderKanban,
    children: [
      { path: "/studio/content/lessons", label: "Lessons", icon: GraduationCap },
      { path: "/studio/content/courses", label: "Courses", icon: Library },
      { path: "/studio/content/paths", label: "Paths", icon: GitMerge },
      { path: "/studio/content/problems", label: "Problem Sets", icon: Puzzle },
    ],
  },
  {
    label: "Library",
    icon: BookText,
    children: [
      { path: "/studio/library/newsroom", label: "Newsroom", icon: Newspaper },
      { path: "/studio/library/books", label: "Scribs", icon: BookText },
      { path: "/studio/library/articles", label: "Articles", icon: FileText },
    ],
  },
];

// --- Refactored & Restyled Sidebar ---

const SidebarHeader = ({ isCollapsed }) => (
  <div className="flex items-center px-4 h-16 border-b border-zinc-700/50">
    <Link
      to="/studio/"
      className="flex items-center gap-3 overflow-hidden"
    >
  <svg
    className="w-11 h-11 flex-shrink-0 text-white"
    viewBox="0 0 600 600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <rect x="100.5" y="252.5" width="12" height="127" fill="white" stroke="white"/>
    <rect x="134.72" y="232.459" width="12" height="355.133" transform="rotate(-60 134.72 232.459)" fill="white" stroke="white"/>
    <rect x="305.117" y="130.723" width="12" height="307.094" transform="rotate(-29.0317 305.117 130.723)" fill="white" stroke="white"/>
    <rect x="118.68" y="243.503" width="12" height="307.094" transform="rotate(-29.0317 118.68 243.503)" fill="white" stroke="white"/>
    <rect x="269.23" y="125.683" width="12" height="307.094" transform="rotate(30 269.23 125.683)" fill="white" stroke="white"/>
    <rect x="454.23" y="231.683" width="12" height="307.094" transform="rotate(30 454.23 231.683)" fill="white" stroke="white"/>
    <rect x="441.765" y="222.125" width="12" height="350.695" transform="rotate(60 441.765 222.125)" fill="white" stroke="white"/>
    <rect x="470.5" y="252.5" width="12" height="127" fill="white" stroke="white"/>
    <rect x="285.5" y="147.5" width="12" height="127" fill="white" stroke="white"/>
    <rect x="285.5" y="358.5" width="12" height="127" fill="white" stroke="white"/>
    <rect x="137.5" y="218.5" width="12" height="295" transform="rotate(-90 137.5 218.5)" fill="white" stroke="white"/>
    <rect x="133.062" y="446.501" width="12" height="144.168" transform="rotate(-60 133.062 446.501)" fill="white" stroke="white"/>
    <rect x="323.683" y="130.075" width="12" height="144.168" transform="rotate(-60 323.683 130.075)" fill="white" stroke="white"/>
    <rect x="446.405" y="432.498" width="12" height="142.229" transform="rotate(60 446.405 432.498)" fill="white" stroke="white"/>
    <rect x="260.857" y="115.683" width="12" height="142.229" transform="rotate(60 260.857 115.683)" fill="white" stroke="white"/>
    <rect x="137.5" y="428.5" width="12" height="295" transform="rotate(-90 137.5 428.5)" fill="white" stroke="white"/>
    <rect x="256.5" y="67.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="71.5" y="386.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="71.5" y="173.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="441.5" y="386.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="441.5" y="173.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="256.5" y="493.5" width="71" height="71" rx="35.5" fill="#D9D9D9" fillOpacity="0.1" stroke="white" strokeWidth="17"/>
    <rect x="258" y="282" width="68" height="68" rx="34" fill="#0C0C0C" stroke="white" strokeWidth="20"/>
  </svg>
      <div
        className={`transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-xl font-light whitespace-nowrap text-zinc-200">
          Vault<span className="font-semibold text-white">X</span>
        </span>
      </div>
    </Link>
  </div>
);

const SidebarNav = ({ isCollapsed, setMobileMenuOpen }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState("");

  useEffect(() => {
    if (isCollapsed) {
      setOpenSection("");
    } else {
      const currentParent = navItems.find((item) =>
        item.children?.some((child) => location.pathname.startsWith(child.path))
      );
      setOpenSection(currentParent?.label || "");
    }
  }, [location.pathname, isCollapsed]);

  const NavItem = ({ item }) => {
    const isSectionOpen = openSection === item.label;

    if (item.children) {
      return (
        <div className="relative group">
          <button
            onClick={() =>
              !isCollapsed && setOpenSection(isSectionOpen ? "" : item.label)
            }
            className="w-full flex items-center justify-between p-3 rounded-md text-left transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isSectionOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {isCollapsed && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.label}
            </div>
          )}

          {!isCollapsed && (
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isSectionOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-2 pl-[1.3rem] ml-3 border-l border-zinc-700 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 pl-4 pr-2 py-2 rounded-md text-sm transition-colors  ${
                          isActive
                            ? "text-white bg-zinc-800"
                            : "border-transparent text-zinc-400 hover:text-zinc-50"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <NavLink
          to={item.path}
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md font-medium transition-colors  ${
              isActive
                ? " text-white bg-zinc-800"
                : "border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
            }`
          }
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
        {isCollapsed && (
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="flex-grow p-2 space-y-1">
      {navItems.map((item) => (
        <NavItem key={item.label || item.path} item={item} />
      ))}
    </nav>
  );
};

const SidebarFooter = ({ isCollapsed, userData, onLogout }) => (
  <div className="p-2 border-t border-zinc-700/50">
    <div className="flex items-center p-2 rounded-md">
      <div className="w-10 h-10 rounded-full border-1 border-zinc-400 flex items-center justify-center font-bold flex-shrink-0 text-white">
        {getInitials(userData.user.first_name, userData.user.last_name)}
      </div>
      <div
        className={`flex justify-between items-center w-full ml-3 overflow-hidden transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <div>
          <p className="text-sm font-semibold text-zinc-50 truncate">
            {userData.user.first_name} {userData.user.last_name}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {userData.user.email}
          </p>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const Sidebar = ({
  isCollapsed,
  userData,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const sidebarContent = (
    <div className={`bg-zinc-900 flex flex-col h-full`}>
      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarNav
        isCollapsed={isCollapsed}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <SidebarFooter
        isCollapsed={isCollapsed}
        userData={userData}
        onLogout={onLogout}
      />
    </div>
  );

  return (
    <>
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:hidden w-64 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

// --- Main Layout Component ---
const StudioLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { isFullScreen, setIsFullScreen } = useContext(LayoutContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking a successful API call for demonstration
    setTimeout(() => {
      setUserData({
        ok: true,
        user: {
          id: 1,
          first_name: "Kruthartha",
          last_name: "S Gowda",
          email: "admin@learningvault.in",
        },
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/studio/login");
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading Studio...</p>
      </div>
    );
  if (!userData)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Failed to load user profile.</p>
      </div>
    );

  return (
    <LayoutContext.Provider value={{ isFullScreen, setIsFullScreen }}>
      <div
        className={`min-h-screen bg-zinc-50 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <CommandPalette
          open={isCommandPaletteOpen}
          setOpen={setCommandPaletteOpen}
        />

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          userData={userData}
          onLogout={handleLogout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex flex-col flex-1">
          {!isFullScreen && (
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="hidden lg:block p-2 text-gray-600 mr-4 rounded-full hover:bg-gray-100"
                    >
                      {isSidebarCollapsed ? (
                        <Indent />
                      ) : (
                        <Outdent />
                      )}
                    </button>
                    <button
                      onClick={() => setMobileMenuOpen(true)}
                      className="lg:hidden p-2 text-gray-600"
                    >
                      <Menu />
                    </button>
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
                    <Notifications />
                  </div>
                </div>
              </div>
            </header>
          )}
          <main className={isFullScreen ? "" : "p-4 sm:p-6 lg:p-8"}>
            <Outlet /> 
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default StudioLayout;
