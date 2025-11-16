import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { addTransaction } from "@/lib/db";
import { categories } from "@/lib/categories";

interface AddTransactionModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function AddTransactionModal({ open, setOpen }: AddTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("other");

  const handleSubmit = async () => {
    if (!amount) return;

    await addTransaction({
      type,
      amount: parseFloat(amount),
      note,
      category,
      date: new Date().toISOString(),
    });

    setAmount("");
    setNote("");
    setType("expense");
    setCategory("other");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Amount */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Note */}
          <div>
            <Label>Note</Label>
            <Input
              placeholder="Groceries, Rent, Salary..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <select
              className="border rounded p-2 w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <select
              className="border rounded p-2 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full">
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
