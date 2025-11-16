import { useEffect, useState } from "react";
import { listenToTransactions, Transaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  // Normalize timestamps
  const normalized = transactions.map((t) => ({
    ...t,
    dateObj: normalizeDate(t),
  }));

  // Group by date
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

                    <p
                      className={`font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹{t.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
