import React from "react";
import ReactDOM from "react-dom/client";
import * as ClerkReact from "@clerk/clerk-react";
import App from "./App";
import { AuthProvider } from "./lib/auth";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const ClerkProvider =
  ((ClerkReact as any).ClerkProvider as React.ComponentType<{
    children: React.ReactNode;
    publishableKey: string;
  }>) ?? (({ children }: { children: React.ReactNode }) => <>{children}</>);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);
