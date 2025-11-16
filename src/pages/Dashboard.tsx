import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import IncomeExpensePie from "@/components/charts/IncomeExpensePie";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import PageWrapper from "@/components/PageWrapper";

// Helper to convert Firestore Timestamp → JS Date
const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  // Normalize all dates
  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  const totalIncome = normalized
    .filter((x) => x.type === "income")
    .reduce((s, x) => s + x.amount, 0);

  const totalExpense = normalized
    .filter((x) => x.type === "expense")
    .reduce((s, x) => s + x.amount, 0);

  const balance = totalIncome - totalExpense;
  const hasData = normalized.length > 0;

  // Trend message
  let trendMsg = "Add your first transaction";
  if (hasData) {
    if (balance > 0) trendMsg = "You’re saving money — great job!";
    else if (balance < 0) trendMsg = "Spending more than earning. Review expenses.";
    else trendMsg = "Balanced month — keep tracking.";
  }

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Balance Card Pro */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-md">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-extrabold mt-1">₹ {balance.toFixed(2)}</p>
          <p className="text-sm mt-2 opacity-90">{trendMsg}</p>
        </div>

        {/* Income Expense Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl shadow-sm border border-green-200 bg-green-50">
            <p className="text-sm text-green-700">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-2xl shadow-sm border border-red-200 bg-red-50">
            <p className="text-sm text-red-700">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">₹ {totalExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Income vs Expense</h2>
          <IncomeExpensePie income={totalIncome} expense={totalExpense} />
        </div>

        {/* Monthly Bar Chart */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Monthly Overview</h2>
          <MonthlyBarChart transactions={normalized} />
        </div>

        {/* Recent Transactions */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>

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
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
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
