import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import BottomNav from "./components/BottomNav";
import FabButton from "./components/FabButton";
import AddTransactionModal from "./components/AddTransactionModal";
import { useState } from "react";
import MonthlySummary from "./pages/MonthlySummary";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter basename="/budget-planner">   {/* FIXED BASE PATH */}
      {/* Modal */}
      <AddTransactionModal open={open} setOpen={setOpen} />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/summary" element={<MonthlySummary />} />
      </Routes>

      {/* Floating Add Button */}
      <FabButton onClick={() => setOpen(true)} />

      {/* Bottom Navigation */}
      <BottomNav />
    </BrowserRouter>
  );
}
