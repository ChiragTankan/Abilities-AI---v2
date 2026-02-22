
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Explorer from './components/Explorer';
import Analyze from './components/Analyze';
import Growth from './components/Growth';
import Pricing from './components/Pricing';
import Connect from './components/Connect';
import TrialOnboarding from './components/TrialOnboarding';
import { UserSubscription, Roadmap } from './types';
import { ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription>({ isPremium: false, plan: 'none' });
  const [currentView, setCurrentView] = useState<'LANDING' | 'EXPLORER' | 'ANALYZE' | 'GROWTH' | 'PRICING' | 'CONNECT'>('LANDING');
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [demoRoadmap, setDemoRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const isNewUser = u && !user;
      setUser(u);
      setAuthInitialized(true);
      
      if (u) {
        const savedVoucher = localStorage.getItem(`voucher_${u.uid}`);
        const voucherExpiry = savedVoucher ? parseInt(savedVoucher) : 0;
        const isVoucherActive = Date.now() < voucherExpiry;
        const creationTime = new Date(u.metadata.creationTime!).getTime();
        const now = Date.now();
        const trialDuration = 7 * 24 * 60 * 60 * 1000;
        const isTrialActive = (now - creationTime) < trialDuration;
        const isPremium = isTrialActive || isVoucherActive;

        setSubscription({ 
          isPremium,
          plan: isVoucherActive ? 'voucher' : 'none',
          trialEndDate: isTrialActive ? "7 Days Active" : undefined
        });

        if (isNewUser && isTrialActive && !isVoucherActive) {
          setShowTrialModal(true);
        }
      }
    });
    
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setIsApiKeyMissing(true);
    }
    return () => unsubscribe();
  }, [user]);

  const navigate = (view: typeof currentView) => {
    if (!user && (view === 'GROWTH' || view === 'EXPLORER' || view === 'ANALYZE')) {
      setShowAuth(true);
      return;
    }
    setCurrentView(view);
    setShowAuth(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoin = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setCurrentView('ANALYZE');
    }
  };

  const handleDemo = () => {
    const mockRoadmap: Roadmap = {
      targetRole: "Senior Software Engineer @ Microsoft",
      plan: [
        { day: 1, title: "System Design Fundamentals", tasks: ["Review CAP Theorem", "Analyze Microservices at scale"], resources: [] },
        { day: 2, title: "Advanced Concurrency", tasks: ["Implement Mutex in Go", "Solve Dining Philosophers"], resources: [] },
        { day: 3, title: "Neural Integration", tasks: ["Deploy LangChain local node", "Context window optimization"], resources: [] }
      ]
    };
    setDemoRoadmap(mockRoadmap);
    setCurrentView('ANALYZE');
  };

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#020604] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout user={user} navigate={navigate} currentView={currentView} isPremium={subscription.isPremium}>
      {isApiKeyMissing && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center gap-6 text-red-400 font-bold shadow-2xl backdrop-blur-xl max-w-5xl mx-auto mt-6">
          <ShieldAlert size={32} className="shrink-0" />
          <div className="flex-1">
            <p className="text-lg mb-0.5 font-semibold">Neural System Offline</p>
            <p className="text-xs font-medium text-red-400/60 leading-relaxed uppercase tracking-widest">System Architecture Key Missing</p>
          </div>
        </div>
      )}

      {showTrialModal && <TrialOnboarding onClose={() => setShowTrialModal(false)} />}

      <AnimatePresence mode="wait">
        {showAuth ? (
          <motion.div key="auth" initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}}>
            <Auth onBack={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setCurrentView('ANALYZE'); }} />
          </motion.div>
        ) : (
          <motion.div 
            key={currentView} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            {currentView === 'LANDING' && <Landing onStart={handleJoin} onDemo={handleDemo} />}
            {currentView === 'EXPLORER' && <Explorer />}
            {currentView === 'ANALYZE' && <Analyze isPremium={subscription.isPremium} initialDemo={demoRoadmap} />}
            {currentView === 'GROWTH' && <Growth />}
            {currentView === 'PRICING' && <Pricing currentPlan={subscription.plan} onUpgrade={() => navigate('ANALYZE')} onApplyVoucher={() => {}} />}
            {currentView === 'CONNECT' && <Connect />}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
