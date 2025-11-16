import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

// ---------------------------------------------
// FIREBASE CONFIG
// ---------------------------------------------
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APPID",
};

// Init
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---------------------------------------------
// TYPES
// ---------------------------------------------
export interface Transaction {
  id: string;
  amount: number;
  note: string;
  type: "income" | "expense";
  category: string;
  date: any;
}

// ---------------------------------------------
// ADD TRANSACTION
// ---------------------------------------------
export async function addTransaction(data: Omit<Transaction, "id">) {
  const ref = collection(db, "transactions");
  await addDoc(ref, data);
}

// ---------------------------------------------
// LISTEN (REALTIME)
// ---------------------------------------------
export function listenToTransactions(
  callback: (items: Transaction[]) => void
) {
  const ref = collection(db, "transactions");
  const q = query(ref, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const list: Transaction[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Transaction[];

    callback(list);
  });
}

// ---------------------------------------------
// UPDATE
// ---------------------------------------------
export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, data);
}

// ---------------------------------------------
// DELETE (NO CONFIRMATION)
// ---------------------------------------------
export async function deleteTransaction(id: string) {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
}
