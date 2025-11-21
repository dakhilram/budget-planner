import { useState, useEffect } from "react";
import { addTransaction } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { serverTimestamp } from "firebase/firestore";
import { categories } from "@/lib/categories";

export default function AddTransactionModal({ open, setOpen }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("other");

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setAmount("");
      setNote("");
      setType("expense");
      setCategory("other");
    }
  }, [open]);

  const handleAdd = async () => {
    if (!amount) return;

    await addTransaction({
      amount: parseFloat(amount),
      note,
      type,
      // category only if not safedrop
      category: type === "safedrop" ? undefined : category,
      date: serverTimestamp(),
    });

    setOpen(false);
  };

  // Filter categories:
  // Income → only "salary" + "other"
  // Expense → everything except "salary"
  const filteredCategories = categories.filter((c) =>
    type === "income"
      ? c.id === "salary" || c.id === "other"
      : type === "expense"
      ? c.id !== "salary"
      : false
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Amount */}
          <input
            type="number"
            placeholder="0.00"
            className="w-full border rounded-lg p-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Note */}
          <input
            type="text"
            placeholder={
              type === "safedrop"
                ? "Bank deposit note (optional)"
                : "Groceries, Rent, Salary…"
            }
            className="w-full border rounded-lg p-3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Type */}
          <select
            className="w-full border rounded-lg p-3"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory("other");
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="safedrop">SafeDrop (Deposit)</option>
          </select>

          {/* Category -> hidden for SafeDrop */}
          {type !== "safedrop" && (
            <select
              className="w-full border rounded-lg p-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          )}

          <Button className="w-full" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
