import { Home, BarChart2, Settings, PieChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  const itemClass = (path: string) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-black font-semibold" : "text-gray-500"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around z-50 shadow-sm">
      <Link to="/" className={itemClass("/")}>
        <Home size={20} />
        Home
      </Link>

      <Link to="/history" className={itemClass("/history")}>
        <BarChart2 size={20} />
        History
      </Link>

      <Link to="/summary" className={itemClass("/summary")}>
        <PieChart size={20} />
        Summary
      </Link>

      <Link to="/settings" className={itemClass("/settings")}>
        <Settings size={20} />
        Settings
      </Link>
    </nav>
  );
}
