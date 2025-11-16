import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { deleteDoc, updateDoc } from "firebase/firestore";


export interface Transaction {
  id?: string;
  type: string; 
  amount: number;
  note: string;
  category: string;  // 👈 ADD THIS
  date: any;
}


import { serverTimestamp } from "firebase/firestore";

export const addTransaction = async (tx: Transaction) => {
  await addDoc(collection(db, "transactions"), {
    ...tx,
    date: serverTimestamp(),
  });
};

export const deleteTransaction = async (id: string) => {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
};

export const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, data);
};


// Listen to all transactions (real-time)
export const listenToTransactions = (callback: (data: Transaction[]) => void) => {
  const q = query(collection(db, "transactions"), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];

    callback(data);
  });
};
