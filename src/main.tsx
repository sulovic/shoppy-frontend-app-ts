import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { AuthProvider } from "./Context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Disable React Developer Tools in production
interface ReactDevToolsHook {
  [key: string]: unknown;
}

if (import.meta.env.PROD) {
  const hook = (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook }).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook && typeof hook === "object") {
    for (const key in hook) {
      const value = hook[key];
      hook[key] = typeof value === "function" ? () => {} : null;
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
