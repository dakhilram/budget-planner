import { useEffect, useState } from "react";
import {
  listenToTransactions,
  Transaction,
  addTransaction,
} from "@/lib/db";
import IncomeExpensePie from "@/components/charts/IncomeExpensePie";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import PageWrapper from "@/components/PageWrapper";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  // Normalize dates
  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  // --------------------------------------------------------------
  // CURRENT MONTH FILTER
  // --------------------------------------------------------------
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthTx = normalized.filter(
    (t) =>
      t.dateObj.getFullYear() === currentYear &&
      t.dateObj.getMonth() === currentMonth
  );

  // --------------------------------------------------------------
  // MONTHLY TOTALS
  // --------------------------------------------------------------
  const monthlyIncome = currentMonthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const monthlyExpense = currentMonthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // --------------------------------------------------------------
  // SAFE DROP (LIFETIME)
  // --------------------------------------------------------------
  const totalSafeDrop = normalized
    .filter((t) => t.type === "safedrop")
    .reduce((s, t) => s + t.amount, 0);

  // --------------------------------------------------------------
  // LIFETIME BALANCE (Income – Expense – SafeDrop)
  // --------------------------------------------------------------
  const lifetimeIncome = normalized
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const lifetimeExpense = normalized
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const availableBalance =
    lifetimeIncome - lifetimeExpense - totalSafeDrop;

  // Trend message
  const hasData = normalized.length > 0;
  let trendMsg = "Add your first transaction";
  if (hasData) {
    if (availableBalance > 0)
      trendMsg = "You’re saving money — great job!";
    else if (availableBalance < 0)
      trendMsg = "Spending more than earning. Review expenses.";
    else trendMsg = "Balanced finances — keep tracking.";
  }

  // --------------------------------------------------------------
  // SEND TO BANK — clears SafeDrop without altering balance
  // --------------------------------------------------------------
  const handleSendToBank = async () => {
    if (totalSafeDrop <= 0) return;
    await addTransaction({
      amount: -totalSafeDrop,
      type: "safedrop",
      note: "SafeDrop transferred to bank",
      category: "safedrop",
      date: new Date(),
    });
    setShowConfirm(false);
  };

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {/* ------------------------------------------------------ */}
        {/* AVAILABLE BALANCE CARD */}
        {/* ------------------------------------------------------ */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-md">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-extrabold mt-1">
            $ {availableBalance.toFixed(2)}
          </p>
          <p className="text-sm mt-2 opacity-90">{trendMsg}</p>
        </div>

        {/* ------------------------------------------------------ */}
        {/* INCOME + EXPENSE (Monthly) */}
        {/* ------------------------------------------------------ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl shadow-sm border border-green-200 bg-green-50">
            <p className="text-sm text-green-700">Income (This Month)</p>
            <p className="text-2xl font-bold text-green-600">
              $ {monthlyIncome.toFixed(2)}
            </p>
          </div>

          <div className="p-4 rounded-2xl shadow-sm border border-red-200 bg-red-50">
            <p className="text-sm text-red-700">Expenses (This Month)</p>
            <p className="text-2xl font-bold text-red-600">
              $ {monthlyExpense.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SAFEDROP CARD — same style as AVAILABLE BALANCE */}
        {/* ------------------------------------------------------ */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5 rounded-2xl shadow-md">
          <p className="text-sm opacity-80">SafeDrop Balance</p>
          <p className="text-3xl font-extrabold mt-1">
            $ {totalSafeDrop.toFixed(2)}
          </p>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-3 bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl shadow hover:bg-gray-100"
          >
            Send to Bank
          </button>
        </div>

        {/* ------------------------------------------------------ */}
        {/* CONFIRMATION MODAL */}
        {/* ------------------------------------------------------ */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center space-y-4">
              <h2 className="text-lg font-bold">Confirm Transfer</h2>
              <p className="text-gray-600">
                Are you sure you want to send your SafeDrop balance to
                the bank?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendToBank}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Yes, Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------ */}
        {/* PIE CHART */}
        {/* ------------------------------------------------------ */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Income vs Expense</h2>
          <IncomeExpensePie
            income={monthlyIncome}
            expense={monthlyExpense}
          />
        </div>

        {/* ------------------------------------------------------ */}
        {/* MONTHLY BAR CHART */}
        {/* ------------------------------------------------------ 
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Monthly Overview</h2>
          <MonthlyBarChart transactions={normalized} />
        </div>*/}

        {/* ------------------------------------------------------ */}
        {/* RECENT TRANSACTIONS */}
        {/* ------------------------------------------------------ */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">
            Recent Transactions
          </h2>

          {normalized.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {normalized.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <div>
                    <p className="font-medium">{t.note}</p>
                    <p className="text-xs text-gray-500">
                      {t.dateObj.toLocaleDateString()}
                    </p>
                  </div>

                  <p
                    className={`font-semibold ${
                      t.type === "income"
                        ? "text-green-600"
                        : t.type === "expense"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
