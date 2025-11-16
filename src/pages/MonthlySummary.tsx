import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";
import TrendLineChart from "@/components/charts/TrendLineChart";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

export default function MonthlySummary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  // Group by month-year
  const monthlyTotals: Record<string, number> = {};
  normalized.forEach((t) => {
    const d = t.dateObj;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const value = t.type === "income" ? t.amount : -t.amount;
    monthlyTotals[key] = (monthlyTotals[key] || 0) + value;
  });

  const labels = Object.keys(monthlyTotals).sort();
  const values = labels.map((k) => monthlyTotals[k]);

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">Monthly Summary</h1>

        {labels.length === 0 ? (
          <p className="text-gray-500">No data yet</p>
        ) : (
          <>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <h2 className="font-semibold mb-2">Trend</h2>
              <TrendLineChart dataPoints={values} />
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <h2 className="font-semibold mb-2">Net Balance Per Month</h2>

              <ul className="space-y-2">
                {labels.map((label, idx) => (
                  <li
                    key={label}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border"
                  >
                    <p className="font-medium">
                      {label.replace("-", "/")}
                    </p>

                    <p
                      className={`font-semibold ${
                        values[idx] >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      $ {values[idx].toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
