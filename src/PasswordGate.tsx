import { useEffect, useState } from "react";

const ACCESS_KEY = "dak_secret_2025"; // Your private key
const MAX_ATTEMPTS = 3;
const COOLDOWN_MINUTES = 10;
const INACTIVITY_MINUTES = 5; // 🔥 Auto-lock after 5 minutes

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authenticated") === "true";
    const storedAttempts = parseInt(localStorage.getItem("failedAttempts") || "0");
    const storedLock = parseInt(localStorage.getItem("lockUntil") || "0");
    const lastActive = parseInt(localStorage.getItem("lastActive") || "0");

    setAuthenticated(storedAuth);
    setFailedAttempts(storedAttempts);
    setLockUntil(storedLock);

    const now = Date.now();

    // ❗ Auto-lock if inactive for more than X minutes
    if (storedAuth && lastActive) {
      if (now - lastActive > INACTIVITY_MINUTES * 60 * 1000) {
        // Auto-lock
        localStorage.removeItem("authenticated");
        setAuthenticated(false);
      }
    }
  }, []);

  const now = Date.now();

  // ⛔ If locked due to too many failed attempts
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

  // 🔓 Authenticated → render the app + track activity
  if (authenticated) {
    // Activity tracking
    useEffect(() => {
      const updateActivity = () => {
        localStorage.setItem("lastActive", String(Date.now()));
      };

      // Listeners for all interactions
      window.addEventListener("click", updateActivity);
      window.addEventListener("keydown", updateActivity);
      window.addEventListener("mousemove", updateActivity);
      window.addEventListener("touchstart", updateActivity);

      // Cleanup listeners
      return () => {
        window.removeEventListener("click", updateActivity);
        window.removeEventListener("keydown", updateActivity);
        window.removeEventListener("mousemove", updateActivity);
        window.removeEventListener("touchstart", updateActivity);
      };
    }, []);

    return <>{children}</>;
  }

  // 🔐 Handle Login
  const handleSubmit = () => {
    if (password === ACCESS_KEY) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("failedAttempts", "0");
      localStorage.setItem("lastActive", String(Date.now())); // Track new activity
      setAuthenticated(true);
      return;
    }

    // ❌ Wrong password
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem("failedAttempts", String(newAttempts));

    if (newAttempts >= MAX_ATTEMPTS) {
      const lock = now + COOLDOWN_MINUTES * 60 * 1000;
      localStorage.setItem("lockUntil", String(lock));
      setLockUntil(lock);
    }
  };

  // 🔒 Password Entry Screen
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
