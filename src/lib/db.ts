import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase";

export interface Transaction {
  id?: string;
  type: string;
  amount: number;
  note: string;
  category: string;
  date: any;  // Firestore Timestamp
}

// Add new transaction
export const addTransaction = async (tx: Omit<Transaction, "id" | "date">) => {
  await addDoc(collection(db, "transactions"), {
    ...tx,
    date: serverTimestamp(),
  });
};

// Delete
export const deleteTransaction = async (id: string) => {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
};

// Update
export const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, data);
};

// Listen (Real-Time)
export const listenToTransactions = (callback: (data: Transaction[]) => void) => {
  const q = query(collection(db, "transactions"), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Transaction[];

    callback(data);
  });
};
