import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8umbuBjAV1dEPpNgaW47LRoVdWdLNX4k",
  authDomain: "budget-planner-4137b.firebaseapp.com",
  projectId: "budget-planner-4137b",
  storageBucket: "budget-planner-4137b.firebasestorage.app",
  messagingSenderId: "231408483708",
  appId: "1:231408483708:web:aeef326f246e5fc3dcb8f9",
  measurementId: "G-LT22DVX3N5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
