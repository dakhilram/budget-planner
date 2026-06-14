import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type NetMonthlyBarChartProps = {
  labels: string[];
  dataPoints: number[];
};

export default function NetMonthlyBarChart({
  labels,
  dataPoints,
}: NetMonthlyBarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Net",
        data: dataPoints,
        backgroundColor: dataPoints.map((value) =>
          value >= 0 ? "#22c55e" : "#ef4444"
        ),
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = Number(context.raw) || 0;
            return `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}