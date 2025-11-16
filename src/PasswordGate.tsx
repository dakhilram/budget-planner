import { useEffect, useState } from "react";

const ACCESS_KEY = "akhil";  // <-- CHANGE THIS

const MAX_ATTEMPTS = 3;
const COOLDOWN_MINUTES = 10;

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authenticated") === "true";
    const storedAttempts = parseInt(localStorage.getItem("failedAttempts") || "0");
    const storedLock = parseInt(localStorage.getItem("lockUntil") || "0");

    setAuthenticated(storedAuth);
    setFailedAttempts(storedAttempts);
    setLockUntil(storedLock);
  }, []);

  const now = Date.now();

  // ⛔ Cooldown logic
  if (lockUntil && lockUntil > now) {
    const minutesLeft = Math.ceil((lockUntil - now) / 60000);
    return (
      <div className="w-full h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-2xl font-bold mb-3">Too Many Attempts</h1>
          <p className="text-red-600">
            Try again in {minutesLeft} minute{minutesLeft > 1 ? "s" : ""}.
          </p>
        </div>
      </div>
    );
  }

  // 🔐 Authenticated → show full app
  if (authenticated) return children;

  const handleSubmit = () => {
    if (password === ACCESS_KEY) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("failedAttempts", "0");
      setAuthenticated(true);
      return;
    }

    // ❌ wrong password
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem("failedAttempts", String(newAttempts));

    if (newAttempts >= MAX_ATTEMPTS) {
      const lock = now + COOLDOWN_MINUTES * 60 * 1000;
      localStorage.setItem("lockUntil", String(lock));
      setLockUntil(lock);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6">
      <div className="max-w-xs w-full border p-6 rounded-xl shadow-md bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Enter Access Key</h1>

        <input
          type="password"
          className="border w-full p-3 rounded-lg mb-4"
          placeholder="Access Key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Unlock
        </button>

        {failedAttempts > 0 && (
          <p className="text-sm text-red-500 mt-3 text-center">
            Incorrect key. {MAX_ATTEMPTS - failedAttempts} attempts remaining.
          </p>
        )}
      </div>
    </div>
  );
}
