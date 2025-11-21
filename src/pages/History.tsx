import { useEffect, useState } from "react";
import { listenToTransactions, Transaction, deleteTransaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";
import EditTransactionModal from "@/components/EditTransactionModal";
import { Pencil, Trash2 } from "lucide-react";
import { categories } from "@/lib/categories";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

// Helper: category info
const getCategoryInfo = (id: string) => {
  return categories.find((c) => c.id === id) || { icon: "", label: id };
};

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editItem, setEditItem] = useState<Transaction | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(""); // "2025-1"

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  // ----- GENERATE AVAILABLE MONTH OPTIONS -----
  const monthKeys: string[] = [];
  normalized.forEach((t) => {
    const d = t.dateObj;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!monthKeys.includes(key)) monthKeys.push(key);
  });

  monthKeys.sort(); // chronological order

  // Default month = latest one
  useEffect(() => {
    if (monthKeys.length > 0 && !selectedMonth) {
      setSelectedMonth(monthKeys[monthKeys.length - 1]);
    }
  }, [monthKeys]);

  // ----- FILTER TRANSACTIONS BY SELECTED MONTH -----
  const filtered = normalized.filter((t) => {
    const d = t.dateObj;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    return key === selectedMonth;
  });

  // ----- GROUP DAILY -----
  const grouped: Record<string, Transaction[]> = {};
  for (const t of filtered) {
    const dateKey = t.dateObj.toLocaleDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">History</h1>

        {/* Month Selector */}
        <select
          className="border rounded-lg p-3 w-full"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthKeys.map((key) => {
            const [year, month] = key.split("-");
            const monthName = new Date(parseInt(year), parseInt(month) - 1)
              .toLocaleString("default", { month: "long" });
            return (
              <option key={key} value={key}>
                {monthName} {year}
              </option>
            );
          })}
        </select>

        {sortedDates.length === 0 ? (
          <p className="text-gray-500">No transactions for this month</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-gray-700 font-semibold mb-2">{date}</h2>

              <div className="space-y-2">
                {grouped[date].map((t) => {
                  const cat = getCategoryInfo(t.category);

                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{t.note}</p>

                        {/* Category (hidden for SafeDrop) */}
                        {t.type !== "safedrop" && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </p>
                        )}

                        {/* SafeDrop Label */}
                        {t.type === "safedrop" && (
                          <p className="text-xs text-blue-600 font-semibold">
                            SafeDrop
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <p
                          className={`font-semibold ${
                            t.type === "income"
                              ? "text-green-600"
                              : t.type === "expense"
                              ? "text-red-600"
                              : "text-blue-600" // SafeDrop
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}${t.amount}
                        </p>

                        <button
                          onClick={() => setEditItem(t)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <EditTransactionModal item={editItem} setItem={setEditItem} />
    </PageWrapper>
  );
}
