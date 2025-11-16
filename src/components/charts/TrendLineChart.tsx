import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function TrendLineChart({ dataPoints }: { dataPoints: number[] }) {
  const labels = dataPoints.map((_, idx) => `Day ${idx + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Trend",
        data: dataPoints,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
