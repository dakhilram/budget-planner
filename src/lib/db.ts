import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ---------------------------------------------
// FIREBASE CONFIG
// ---------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD8umbuBjAV1dEPpNgaW47LRoVdWdLNX4k",
  authDomain: "budget-planner-4137b.firebaseapp.com",
  projectId: "budget-planner-4137b",
  storageBucket: "budget-planner-4137b.firebasestorage.app",
  messagingSenderId: "231408483708",
  appId: "1:231408483708:web:aeef326f246e5fc3dcb8f9",
  measurementId: "G-LT22DVX3N5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ---------------------------------------------
// SECURE FIRESTORE INSTANCE WITH SECRET HEADER
// ---------------------------------------------
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: false,
  experimentalAutoDetectLongPolling: true,
  headers: {
    "X-App-Secret": "dak_secret_2025"   // ⭐ SECRET ONLY YOUR APP KNOWS
  }
});

// ---------------------------------------------
// TYPES
// ---------------------------------------------
export interface Transaction {
  id: string;
  amount: number;
  note: string;
  type: "income" | "expense";
  category: string;
  date: any; // Firestore Timestamp
}

// ---------------------------------------------
// ADD TRANSACTION
// ---------------------------------------------
export async function addTransaction(data: Omit<Transaction, "id">) {
  const ref = collection(db, "transactions");
  await addDoc(ref, {
    ...data,
    date: serverTimestamp(),  // always save proper Firestore timestamp
  });
}

// ---------------------------------------------
// LISTEN TO ALL TRANSACTIONS
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
// DELETE
// ---------------------------------------------
export async function deleteTransaction(id: string) {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
}
