import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        {mode === "login" ? (
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/signup"
            appearance={{
              variables: {
                colorPrimary: "#10b981",
                colorBackground: "#18181b",
                colorText: "#ffffff",
                colorInputBackground: "#000000",
                colorInputText: "#ffffff",
              },
              elements: {
                card: "bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl",
                headerTitle: "text-white",
                headerSubtitle: "text-zinc-500",
                socialButtonsBlockButton: "bg-black/50 border-white/10 text-white hover:bg-zinc-800",
                formButtonPrimary: "bg-emerald-500 text-black hover:bg-emerald-400",
                footerActionLink: "text-emerald-400 hover:text-emerald-300",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-emerald-400",
              }
            }}
          />
        ) : (
          <SignUp 
            routing="path" 
            path="/signup" 
            signInUrl="/login"
            appearance={{
              variables: {
                colorPrimary: "#10b981",
                colorBackground: "#18181b",
                colorText: "#ffffff",
                colorInputBackground: "#000000",
                colorInputText: "#ffffff",
              },
              elements: {
                card: "bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl",
                headerTitle: "text-white",
                headerSubtitle: "text-zinc-500",
                socialButtonsBlockButton: "bg-black/50 border-white/10 text-white hover:bg-zinc-800",
                formButtonPrimary: "bg-emerald-500 text-black hover:bg-emerald-400",
                footerActionLink: "text-emerald-400 hover:text-emerald-300",
              }
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
