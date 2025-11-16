import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import IncomeExpensePie from "@/components/charts/IncomeExpensePie";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import PageWrapper from "@/components/PageWrapper";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  // Convert Firestore timestamp or ISO string → JS Date
  const normalizeDate = (tx: Transaction) => {
    if (tx.date?.seconds) {
      return new Date(tx.date.seconds * 1000);
    }
    return new Date(tx.date);
  };

  // Safe values for charts
  const txWithFixedDates = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  const totalExpense = txWithFixedDates
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = txWithFixedDates
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₹ {totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ₹ {totalExpense.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <IncomeExpensePie income={totalIncome} expense={totalExpense} />

        {/* Monthly Bar Chart */}
        <MonthlyBarChart transactions={txWithFixedDates} />
      </div>
    </PageWrapper>
  );
}
