import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";     // FIXED EXTENSION
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
