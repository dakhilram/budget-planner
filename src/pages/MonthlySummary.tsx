import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import { categories } from "@/lib/categories";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import PageWrapper from "@/components/PageWrapper";

export default function MonthlySummary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().getMonth()); // 0 = Jan

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  // Filter by month
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month;
  });

  // Income / Expense totals
  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Category totals
  const categoryTotals: Record<string, number> = {};
  filtered.forEach((t) => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
    categoryTotals[t.category] += t.amount;
  });

  // Top category
  const topCategoryId =
    Object.keys(categoryTotals).sort(
      (a, b) => categoryTotals[b] - categoryTotals[a]
    )[0] || null;

  const topCategory = categories.find((c) => c.id === topCategoryId);

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">Monthly Summary</h1>

        {/* Month Selector */}
        <select
          className="p-3 border rounded-xl shadow-sm"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(2023, i, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        {/* Income / Expense Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₹ {totalIncome}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ₹ {totalExpense}
            </p>
          </div>
        </div>

        {/* Top Category */}
        {topCategory && (
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Top Spending Category</p>
            <p className="text-xl font-semibold mt-1">
              {topCategory.icon} {topCategory.label}
            </p>
          </div>
        )}

        {/* Category Pie Chart */}
        <CategoryPieChart data={categoryTotals} />

        {/* Trend Line */}
        <TrendLineChart transactions={filtered} month={month} />
      </div>
    </PageWrapper>
  );
}
