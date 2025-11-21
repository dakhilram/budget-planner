import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { updateTransaction } from "@/lib/db";
import { categories } from "@/lib/categories";

interface Props {
  item: any;
  setItem: (v: any) => void;
}

export default function EditTransactionModal({ item, setItem }: Props) {
  const open = !!item;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("other");

  useEffect(() => {
    if (item) {
      setAmount(String(item.amount));
      setNote(item.note);
      setType(item.type);
      setCategory(item.category ?? "other");
    }
  }, [item]);

  const handleUpdate = async () => {
    if (!item) return;

    const data: any = {
      amount: parseFloat(amount),
      note,
      type,
    };

    // category only for non-safedrop
    if (type !== "safedrop") {
      data.category = category;
    } else {
      data.category = null; // Firestore-safe
    }

    await updateTransaction(item.id, data);
    setItem(null);
  };

  return (
    <Dialog open={open} onOpenChange={() => setItem(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <Label>Note</Label>
            <Input
              placeholder={
                type === "safedrop"
                  ? "Bank deposit note (optional)"
                  : "Description..."
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <select
              className="border rounded p-2 w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="safedrop">SafeDrop (Deposit)</option>
            </select>
          </div>

          {type !== "safedrop" && (
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
          )}

          <Button onClick={handleUpdate} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
