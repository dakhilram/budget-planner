import { NavLink } from "react-router-dom";
import { Home, History, Settings } from "lucide-react";

export default function BottomNav() {
  const navItems = [
    { to: "", label: "Dashboard", icon: <Home size={20} /> },
    { to: "history", label: "History", icon: <History size={20} /> },
    { to: "summary", label: "Summary", icon: <History size={20} /> },
    { to: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ""}   // prevents "/" matching all routes
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-500"
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
