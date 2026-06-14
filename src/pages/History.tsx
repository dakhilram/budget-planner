import { useEffect, useState } from "react";
import { listenToTransactions, Transaction, deleteTransaction } from "@/lib/db";
import PageWrapper from "@/components/PageWrapper";
import EditTransactionModal from "@/components/EditTransactionModal";
import { Pencil, Trash2, Search, X } from "lucide-react";
import { categories } from "@/lib/categories";
import CategoryPieChart from "@/components/charts/CategoryPieChart";

type NormalizedTransaction = Transaction & {
  amount: number;
  dateObj: Date;
};

const normalizeDate = (t: Transaction) => {
  if (t.date?.seconds) return new Date(t.date.seconds * 1000);
  return new Date(t.date);
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const formatDateLabel = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

const formatFullDateLabel = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getCategoryInfo = (id: string | undefined) => {
  if (!id) return { icon: "", label: "Unknown" };
  return categories.find((c) => c.id === id) || { icon: "", label: id };
};

const getAmountClass = (type: Transaction["type"]) => {
  if (type === "income") return "text-green-600";
  if (type === "expense") return "text-red-600";
  return "text-blue-600";
};

const getSignedAmount = (t: NormalizedTransaction) => {
  const sign = t.type === "income" ? "+" : "-";
  return `${sign}$${Math.abs(t.amount).toFixed(2)}`;
};

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editItem, setEditItem] = useState<Transaction | null>(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  const normalized: NormalizedTransaction[] = transactions.map((t) => ({
    ...t,
    amount: Number(t.amount) || 0,
    dateObj: normalizeDate(t),
  }));

  const monthKeys: string[] = [];

  normalized.forEach((t) => {
    const key = getMonthKey(t.dateObj);
    if (!monthKeys.includes(key)) monthKeys.push(key);
  });

  monthKeys.sort();

  useEffect(() => {
    if (monthKeys.length > 0 && !selectedMonth) {
      setSelectedMonth(monthKeys[monthKeys.length - 1]);
    }
  }, [monthKeys, selectedMonth]);

  const filtered = normalized.filter((t) => {
    return getMonthKey(t.dateObj) === selectedMonth;
  });

  const categoryTotals: Record<string, number> = {};

  filtered
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category ?? "unknown";
      if (!categoryTotals[cat]) categoryTotals[cat] = 0;
      categoryTotals[cat] += Math.abs(t.amount);
    });

  const grouped: Record<string, NormalizedTransaction[]> = {};

  for (const t of filtered) {
    const dateKey = formatDateLabel(t.dateObj);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const query = searchQuery.trim().toLowerCase();

  const searchResults = normalized
    .filter((t) => {
      if (!query) return false;

      const cat = getCategoryInfo(t.category);

      const searchableText = [
        t.note,
        t.type,
        t.category,
        cat.label,
        String(t.amount),
        formatDateLabel(t.dateObj),
        formatFullDateLabel(t.dateObj),
        formatMonthLabel(getMonthKey(t.dateObj)),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    })
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  const renderTransactionCard = (t: NormalizedTransaction) => {
    const cat = getCategoryInfo(t.category);

    return (
      <div
        key={t.id}
        className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm"
      >
        <div className="min-w-0">
          <p className="font-medium truncate">{t.note}</p>

          {t.type !== "safedrop" && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </p>
          )}

          {t.type === "safedrop" && (
            <p className="text-xs text-blue-600 font-semibold">SafeDrop</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p className={`font-semibold ${getAmountClass(t.type)}`}>
            {getSignedAmount(t)}
          </p>

          <button
            onClick={() => {
              setEditItem(t);
              setSearchOpen(false);
            }}
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
  };

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">History</h1>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm text-sm font-medium"
          >
            <Search size={18} />
            Search
          </button>
        </div>

        <select
          className="border rounded-lg p-3 w-full bg-white"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthKeys.map((key) => (
            <option key={key} value={key}>
              {formatMonthLabel(key)}
            </option>
          ))}
        </select>

        {Object.keys(categoryTotals).length > 0 ? (
          <CategoryPieChart data={categoryTotals} />
        ) : (
          <p className="text-gray-500">No expense data for this month</p>
        )}

        {sortedDates.length === 0 ? (
          <p className="text-gray-500">No transactions for this month</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-gray-700 font-semibold mb-2">{date}</h2>

              <div className="space-y-2">
                {grouped[date].map((t) => renderTransactionCard(t))}
              </div>
            </div>
          ))
        )}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center px-4 pt-20">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4 max-h-[75vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Search Transactions</h2>

              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                autoFocus
                type="text"
                placeholder="Search note, category, amount, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-xl py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-y-auto space-y-3 pr-1">
              {!query ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Start typing to search your full transaction history.
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No matching transactions found.
                </p>
              ) : (
                <>
                  <p className="text-xs text-gray-500">
                    {searchResults.length} result
                    {searchResults.length === 1 ? "" : "s"} found
                  </p>

                  {searchResults.map((t) => (
                    <div key={t.id} className="space-y-1">
                      <p className="text-xs text-gray-500">
                        {formatFullDateLabel(t.dateObj)}
                      </p>

                      {renderTransactionCard(t)}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <EditTransactionModal item={editItem} setItem={setEditItem} />
    </PageWrapper>
  );
}