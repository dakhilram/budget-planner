import { Pie } from "react-chartjs-2";

export default function IncomeExpensePie({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Income vs Expenses</h2>
      <Pie data={data} />
    </div>
  );
}
