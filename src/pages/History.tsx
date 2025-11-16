import { useEffect, useState } from "react";
import { listenToTransactions, Transaction, deleteTransaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";
import EditTransactionModal from "@/components/EditTransactionModal";
import { Pencil, Trash2 } from "lucide-react";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editItem, setEditItem] = useState<Transaction | null>(null);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  const grouped: Record<string, Transaction[]> = {};
  for (const t of normalized) {
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

        {sortedDates.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-gray-700 font-semibold mb-2">{date}</h2>

              <div className="space-y-2">
                {grouped[date].map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{t.note}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p
                        className={`font-semibold ${
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₹{t.amount}
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
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <EditTransactionModal item={editItem} setItem={setEditItem} />
    </PageWrapper>
  );
}
