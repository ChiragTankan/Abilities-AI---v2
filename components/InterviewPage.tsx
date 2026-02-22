import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, User, Bot, Loader2, Trophy, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/src/lib/auth";
import { cn } from "@/src/lib/utils";
import { getInterviewResponse } from "@/src/services/gemini";

export function InterviewPage() {
  const { user, authenticatedFetch } = useAuth();
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [error, setError] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [resumeText, setResumeText] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const startInterview = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authenticatedFetch("/api/interview/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setTargetRole(data.targetRole);
      setResumeText(data.resumeText);
      setStarted(true);
      
      // Initial greeting
      const firstMsg = { role: "assistant", content: `Hello! I'm your interviewer today for the ${data.targetRole} position. I've reviewed your resume. To start, could you tell me a bit about yourself and why you're interested in this role?` };
      setMessages([firstMsg]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await getInterviewResponse(
        currentInput,
        messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", content: m.content })),
        targetRole,
        resumeText
      );
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // In a real app, we'd ask Gemini for feedback here
      const feedbackText = "Great job! You showed strong technical knowledge and clear communication. Focus more on quantifying your achievements in future interviews.";
      await authenticatedFetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: messages, feedback: feedbackText }),
      });
      setFeedback(feedbackText);
      setFinished(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (finished) {
    return (
      <div className="min-h-screen pt-32 bg-black flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Interview Complete!</h2>
          <div className="bg-black/50 p-6 rounded-2xl text-left border border-white/5">
            <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">AI Feedback</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">{feedback}</p>
          </div>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen pt-32 bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">Mock Interview</h1>
            <p className="text-zinc-500">
              Practice your skills with our AI hiring manager. Get realistic questions based on your resume and target role.
            </p>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-bold uppercase">Your Status</span>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                  user?.is_premium ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                )}>
                  {user?.is_premium ? "Premium" : "Free"}
                </span>
              </div>
              <p className="text-white text-sm font-medium">
                {user?.is_premium 
                  ? "Unlimited mock interviews available." 
                  : `${1 - (user?.free_interviews_used || 0)} free interview remaining.`}
              </p>
            </div>
          )}

          <button
            disabled={loading || (!!error && !user?.is_premium)}
            onClick={startInterview}
            className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Interview"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-4 bg-black flex flex-col px-4">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">AI Interviewer</h3>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Hiring Manager for {targetRole}</p>
            </div>
          </div>
          <button 
            onClick={handleFinish}
            className="text-emerald-500 hover:text-emerald-400 transition-colors text-xs font-bold flex items-center gap-1"
          >
            Finish Interview
          </button>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === "user" ? "bg-zinc-800" : "bg-emerald-500/20"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-emerald-500 text-black font-medium rounded-tr-none" 
                    : "bg-zinc-800/50 text-zinc-200 border border-white/5 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Interviewer is typing...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-3 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
