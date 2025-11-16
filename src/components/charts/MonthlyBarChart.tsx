import { Bar } from "react-chartjs-2";
import { Transaction } from "@/lib/db";

export default function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const monthlyTotals: Record<string, number> = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    if (!monthlyTotals[month]) monthlyTotals[month] = 0;

    monthlyTotals[month] += t.type === "income" ? t.amount : -t.amount;
  });

  const labels = Object.keys(monthlyTotals);
  const values = Object.values(monthlyTotals);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Monthly Overview</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Net",
              data: values,
              backgroundColor: values.map((v) =>
                v >= 0 ? "#22c55e" : "#ef4444"
              ),
            },
          ],
        }}
      />
    </div>
  );
}
