import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Target, FileText, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { generateRoadmap } from "@/services/ai";

export function OnboardingPage() {
  const [step, setStep] = React.useState(1);
  const [targetRole, setTargetRole] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { user, authenticatedFetch, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !targetRole) return;
    setLoading(true);
    setError("");
    setStatus("Analyzing resume...");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    try {
      // 1. Upload resume and save goal
      const res = await authenticatedFetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload resume");
      
      const { goalId, resumeText } = await res.json();
      
      // 2. Generate roadmap on client
      setStatus("Building your AI roadmap...");
      const roadmap = await generateRoadmap(targetRole, resumeText, authenticatedFetch);
      
      // 3. Save roadmap to backend
      setStatus("Saving your path...");
      const saveRes = await authenticatedFetch("/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, roadmap }),
      });

      if (!saveRes.ok) throw new Error("Failed to save roadmap");

      await refreshUser();
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= i ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 flex-1 mx-4 rounded-full transition-colors ${
                    step > i ? "bg-emerald-500" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-3xl"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">What's your goal?</h2>
                <p className="text-zinc-500">Tell us the role you're aiming for.</p>
              </div>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                disabled={!targetRole}
                onClick={() => setStep(2)}
                className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Upload your resume</h2>
                <p className="text-zinc-500">We'll extract your skills to build your path.</p>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                  file ? "border-emerald-500 bg-emerald-500/5" : "border-white/10 hover:border-emerald-500/50"
                }`}
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-10 h-10 text-emerald-500" />
                    <span className="text-white font-medium">{file.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-red-500 text-sm">Remove</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-white font-medium">Click to upload or drag & drop</p>
                    <p className="text-zinc-500 text-sm">PDF (max. 5MB)</p>
                  </div>
                )}
              </div>

              {status && (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {status}
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={!file || loading}
                  onClick={handleUpload}
                  className="flex-[2] bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Roadmap"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Roadmap Ready!</h2>
              <p className="text-zinc-400">
                Our AI has analyzed your profile and built a custom path to becoming a <span className="text-emerald-400 font-bold">{targetRole}</span>.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
