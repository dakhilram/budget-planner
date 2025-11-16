import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function TrendLineChart({
  transactions,
  month,
}: {
  transactions: any[];
  month: number;
}) {
  // daily totals for the month
  const days = new Date(2023, month + 1, 0).getDate();
  const labels = Array.from({ length: days }, (_, i) => i + 1);

  const dailyTotals = new Array(days).fill(0);

  transactions.forEach((t) => {
    const d = new Date(t.date).getDate();
    const value = t.type === "income" ? t.amount : -t.amount;
    dailyTotals[d - 1] += value;
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-5">
      <h2 className="text-lg font-semibold mb-3">Daily Trend</h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Net Amount",
              data: dailyTotals,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.3)",
            },
          ],
        }}
      />
    </div>
  );
}
