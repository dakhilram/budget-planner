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

export default function AddTransactionModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!amount || !note) return;

    await addTransaction({
      type,
      amount: Number(amount),
      note,
      category,
    });

    setAmount("");
    setNote("");
    setCategory("");
    setType("expense");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="add-transaction-description">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div id="add-transaction-description" className="space-y-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <Label>Note</Label>
            <Input
              value={note}
              placeholder="Groceries, Salary..."
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Input
              value={category}
              placeholder="Food, Travel, Income Source..."
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <select
              className="w-full border rounded p-2"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
