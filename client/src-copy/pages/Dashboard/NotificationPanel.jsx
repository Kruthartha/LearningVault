// src/components/Notifications.js

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bell, X } from "lucide-react";

// --- Mock Data (replace with your actual data fetching) ---
const initialNotifications = [
  {
    id: 1,
    message: "You've unlocked a new achievement: 'Frequent Flyer'.",
    time: "15 minutes ago",
    unread: true,
    type: "achievement",
  },
  {
    id: 2,
    message: "Your weekly report is ready for review.",
    time: "1 hour ago",
    unread: true,
    type: "reminder",
  },
  {
    id: 3,
    message: "A new team member, Alex, has joined your project.",
    time: "4 hours ago",
    unread: false,
    type: "reminder",
  },
];

// --- SVG Icons (self-contained, no need for a library) ---
// const Bell = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
//     <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
//   </svg>
// );

// const X = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <path d="M18 6 6 18" />
//     <path d="m6 6 12 12" />
//   </svg>
// );


// --- Main Component ---
export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showPanel, setShowPanel] = useState(false);
  const [panelPosition, setPanelPosition] = useState({});
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const hasUnread = notifications.some((n) => n.unread);

  // Function to calculate and set panel position
  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (window.innerWidth >= 768) { // md breakpoint
        setPanelPosition({
          position: "absolute",
          top: `${rect.bottom + 12}px`, // Add some margin
          left: `${rect.right}px`,
          transform: "translateX(-100%)",
        });
      } else {
        setPanelPosition({}); // Reset for mobile (uses fixed inset-0)
      }
    }
  };

  // Effect to close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPanel &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  // Effect to recalculate position on resize
  useEffect(() => {
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, []);

  const handleToggle = () => {
    if (!showPanel) {
      calculatePosition();
    }
    setShowPanel((prev) => !prev);
  };
  
  const handleMarkAsRead = (id) => {
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, unread: false } : n
        )
      );
      // Optional: close panel after clicking an item
      // setShowPanel(false); 
  };
  
  const handleMarkAllAsRead = () => {
      setNotifications(
        notifications.map((n) => ({...n, unread: false}))
      );
  };

  return (
    <div className="relative" ref={triggerRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Open notifications"
        aria-expanded={showPanel}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <div className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </div>
        )}
      </button>

      {showPanel &&
        ReactDOM.createPortal(
          <div
            ref={panelRef}
            style={panelPosition}
            className="fixed inset-0 md:absolute md:inset-auto z-50 bg-white md:w-80 md:max-w-sm md:rounded-xl md:shadow-2xl md:border md:border-gray-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-heading"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 id="notification-heading" className="text-gray-900">
                  Notifications
                </h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto min-h-0">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-xl mt-0.5">
                          {notification.type === "achievement" ? "🏆" : "⏰"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" title="Unread"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <Bell className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="font-medium">You're all caught up!</p>
                    <p className="text-sm">No new notifications.</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {hasUnread && (
                <div className="flex-shrink-0 p-3 border-t border-gray-200">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}