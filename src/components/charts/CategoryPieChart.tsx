import { Pie } from "react-chartjs-2";
import { categories } from "@/lib/categories";

export default function CategoryPieChart({ data }: { data: Record<string, number> }) {
  const labels = Object.keys(data).map(
    (id) => categories.find((c) => c.id === id)?.label ?? id
  );

  const values = Object.values(data);
  const colors = [
    "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
    "#a855f7", "#ec4899", "#14b8a6",
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">Category Breakdown</h2>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
            },
          ],
        }}
      />
    </div>
  );
}
