import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, BookOpen, Zap, Calendar, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/lib/auth";
import { cn } from "@/src/lib/utils";

export function Dashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [roadmap, setRoadmap] = React.useState<any[]>([]);
  const [goal, setGoal] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchRoadmap = async () => {
    try {
      const res = await authenticatedFetch("/api/roadmap");
      const data = await res.json();
      setRoadmap(data.roadmap);
      setGoal(data.goal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRoadmap();
  }, []);

  const toggleTask = async (taskId: number) => {
    try {
      await authenticatedFetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
      fetchRoadmap();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading your path...</div>;

  if (!goal) {
    return (
      <div className="min-h-screen pt-32 bg-black text-center px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto">
            <Zap className="w-10 h-10 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Roadmap Found</h2>
          <p className="text-zinc-500">You haven't set a career goal yet. Let's get started!</p>
          <button
            onClick={() => window.location.href = "/onboarding"}
            className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Create Your Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Trophy className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest">Target Role</p>
              <p className="text-white font-bold">{goal.target_role}</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest">Current Streak</p>
              <p className="text-white font-bold">{user?.current_streak} Days</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest">Progress</p>
              <p className="text-white font-bold">
                {roadmap.filter(d => d.is_completed).length} / {roadmap.length} Days
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Roadmap</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roadmap.map((day, idx) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "bg-zinc-900/50 border rounded-3xl p-6 transition-all",
                  day.is_completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-zinc-800">0{day.day_number}</span>
                    <h3 className="text-lg font-bold text-white">Day {day.day_number}</h3>
                  </div>
                  {day.is_completed ? (
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  ) : (
                    <div className="text-zinc-600 text-xs font-bold uppercase">In Progress</div>
                  )}
                </div>

                <div className="space-y-4">
                  {day.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                        task.is_completed 
                          ? "bg-emerald-500/10 border-emerald-500/20" 
                          : "bg-black/40 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="mt-1">
                        {task.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-700 group-hover:text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                            task.type === "LEARNING" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                          )}>
                            {task.type}
                          </span>
                          <h4 className={cn(
                            "text-sm font-bold",
                            task.is_completed ? "text-zinc-500 line-through" : "text-white"
                          )}>
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
