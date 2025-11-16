import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Transaction } from "@/lib/db";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MonthlyBarChart({
  transactions,
}: {
  transactions: any[];
}) {

  const monthly: Record<string, number> = {};

  transactions.forEach((t) => {
    const d = t.dateObj;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthly[key] = (monthly[key] || 0) + (t.type === "expense" ? -t.amount : t.amount);
  });

  const labels = Object.keys(monthly);
  const values = Object.values(monthly);

  const data = {
    labels,
    datasets: [
      {
        label: "Net Balance",
        data: values,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return <Bar data={data} />;
}
