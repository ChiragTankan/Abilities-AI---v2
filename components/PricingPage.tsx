import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, Rocket, Shield, Loader2, Gift } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function PricingPage() {
  const { user, refreshUser, authenticatedFetch } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [cheatCode, setCheatCode] = React.useState("");
  const [cheatLoading, setCheatLoading] = React.useState(false);
  const [cheatMessage, setCheatMessage] = React.useState("");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch("/api/checkout/create", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheatCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheatLoading(true);
    setCheatMessage("");
    try {
      const res = await authenticatedFetch("/api/cheat-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cheatCode })
      });
      const data = await res.json();
      if (res.ok) {
        setCheatMessage(data.message);
        await refreshUser();
      } else {
        setCheatMessage(data.error);
      }
    } catch (e) {
      setCheatMessage("Error applying code");
    } finally {
      setCheatLoading(false);
    }
  };

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for exploring your potential.",
      features: [
        "7-Day AI Career Roadmap",
        "1 Mock Interview session",
        "Basic streak tracking",
        "Community support"
      ],
      cta: "Current Plan",
      highlight: false,
      disabled: true
    },
    {
      name: "Premium Beta",
      price: "$29",
      description: "Everything you need to land the job.",
      features: [
        "Full 30-Day AI Career Roadmap",
        "Unlimited Mock Interviews",
        "Advanced feedback engine",
        "Priority AI processing",
        "Exclusive Beta badge"
      ],
      cta: user?.is_premium ? "Already Premium" : "Upgrade Now",
      highlight: true,
      disabled: user?.is_premium
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4"
          >
            Simple, Transparent <span className="text-emerald-500">Pricing</span>
          </motion.h1>
          <p className="text-zinc-500 text-lg">Invest in your future with Abilities AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative p-8 rounded-3xl border flex flex-col",
                tier.highlight 
                  ? "bg-zinc-900 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]" 
                  : "bg-zinc-900/50 border-white/10"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-zinc-500 text-sm">/one-time</span>
                </div>
                <p className="text-zinc-500 text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={tier.disabled || loading}
                onClick={tier.highlight ? handleCheckout : undefined}
                className={cn(
                  "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                  tier.highlight 
                    ? "bg-emerald-500 text-black hover:bg-emerald-400" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {loading && tier.highlight ? <Loader2 className="w-5 h-5 animate-spin" /> : tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cheat Code Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto bg-zinc-900/30 border border-white/5 p-8 rounded-3xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-zinc-500">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Have a Beta Code?</span>
          </div>
          <form onSubmit={handleCheatCode} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code..."
              value={cheatCode}
              onChange={(e) => setCheatCode(e.target.value)}
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={cheatLoading || !cheatCode}
              className="bg-white text-black font-bold px-6 py-2 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {cheatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
            </button>
          </form>
          {cheatMessage && (
            <p className={cn(
              "mt-4 text-sm font-medium",
              cheatMessage.includes("Access") ? "text-emerald-400" : "text-red-400"
            )}>
              {cheatMessage}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
