import { useState } from "react";
import { addTransaction } from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

const incomeCategories = [
  "Salary",
  "Business",
  "Freelancing",
  "Gift",
  "Other",
];

export default function AddTransactionModal({ open, setOpen }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Other");

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  const handleAdd = async () => {
    if (!amount || !category) return;

    await addTransaction({
      amount: parseFloat(amount),
      note,
      type,
      category,
      date: new Date().toISOString(),
    });

    setAmount("");
    setNote("");
    setCategory("Other");
    setType("expense");
    setOpen(false);
  };

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
            placeholder="Groceries, Rent, Salary…"
            className="w-full border rounded-lg p-3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* Type */}
          <select
            className="w-full border rounded-lg p-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Category */}
          <select
            className="w-full border rounded-lg p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <Button className="w-full" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
