import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Target, Zap, Shield, CheckCircle2, ArrowRight, PlayCircle } from "lucide-react";

export function LandingPage() {
  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3 h-3 fill-emerald-400" />
            Now in Beta - Join 5,000+ users
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]"
          >
            LAND YOUR <br />
            <span className="text-emerald-500">DREAM ROLE</span> <br />
            WITH AI.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Upload your resume, set your goal, and let our AI build your daily roadmap to professional success. Practice with realistic mock interviews.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Engineered for Success</h2>
            <p className="text-zinc-500">Everything you need to accelerate your career growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <Target className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Roadmaps</h3>
                <p className="text-zinc-400 max-w-md">
                  Our AI analyzes your resume and target role to create a surgical daily learning path. No more guessing what to learn next.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            </div>
            
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <Zap className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">Daily Streaks</h3>
                <p className="text-zinc-400">
                  Stay motivated with gamified progress tracking. Build habits that lead to high-paying roles.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      U{i}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-zinc-500">+1.2k active today</span>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
              <Rocket className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Mock Interviews</h3>
              <p className="text-zinc-400">
                Practice with an AI hiring manager. Get real-time feedback on your answers and body language.
              </p>
            </div>
            
            <div className="md:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <Shield className="w-10 h-10 text-purple-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">Resume Extraction</h3>
                <p className="text-zinc-400 max-w-md">
                  Simply drop your PDF. Our system extracts your skills and experience automatically to build your profile.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">94%</div>
            <div className="text-zinc-500 text-sm uppercase tracking-widest">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">12k+</div>
            <div className="text-zinc-500 text-sm uppercase tracking-widest">Roadmaps Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-zinc-500 text-sm uppercase tracking-widest">Mock Interviews</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">2.4x</div>
            <div className="text-zinc-500 text-sm uppercase tracking-widest">Salary Increase</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to level up?</h2>
          <p className="text-zinc-400 text-lg mb-12">
            Join the elite circle of professionals using AI to dominate their career paths.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
