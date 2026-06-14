import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
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

type TrendLineChartProps = {
  labels: string[];
  dataPoints: number[];
};

export default function TrendLineChart({
  labels,
  dataPoints,
}: TrendLineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Net Balance",
        data: dataPoints,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}