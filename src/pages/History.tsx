import { useEffect, useState } from "react";
import {
  listenToTransactions,
  Transaction,
  deleteTransaction,
} from "@/lib/db";
import { categories } from "@/lib/categories";
import { Trash2, Pencil } from "lucide-react";
import EditTransactionModal from "@/components/EditTransactionModal";
import PageWrapper from "@/components/PageWrapper";

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editItem, setEditItem] = useState<Transaction | null>(null);

  useEffect(() => {
    const stop = listenToTransactions(setTransactions);
    return () => stop();
  }, []);

  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-6">
        <h1 className="text-2xl font-bold">History</h1>

        <EditTransactionModal item={editItem} setItem={setEditItem} />

        <div className="space-y-3">
          {transactions.map((t) => {
            const category = categories.find((c) => c.id === t.category);

            return (
              <div
                key={t.id}
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
              >
                {/* Left Side (Note, Date, Category) */}
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {category?.icon || "❓"} {t.note}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(t.date).toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500">
                    Category: {category?.label || "Unknown"}
                  </p>
                </div>

                {/* Right Side (Amount, Edit, Delete) */}
                <div className="flex items-center gap-3">
                  <p
                    className={`font-bold ${
                      t.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{t.amount}
                  </p>

                  {/* Edit Button */}
                  <button
                    onClick={() => setEditItem(t)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTransaction(t.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
