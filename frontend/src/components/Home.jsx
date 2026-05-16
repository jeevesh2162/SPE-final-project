import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight, ShieldCheck, Zap, Mic2, BarChart3 } from "lucide-react";
import { UserContext } from "../useContext";

export const Home = () => {
  const { user } = useContext(UserContext);
  const isLoggedIn = !!localStorage.getItem("loggedinuser");

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
            >
              <Sparkles size={16} />
              <span>AI-Powered Interview Excellence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              Master Your <br />
              <span className="gradient-text">Future Career</span> <br />
              with Scholar's Study
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-xl leading-relaxed"
            >
              Experience the next generation of interview preparation. Our AI-driven platform simulates real-world technical scenarios, provides spoken feedback, and analyzes your performance with mentor-level precision.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {isLoggedIn ? (
                <Link to="/speechToText" className="glass-button !px-8 !py-4 text-lg flex items-center gap-2">
                  Start Interview <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="glass-button !px-8 !py-4 text-lg flex items-center gap-2 bg-indigo-600 border-none hover:bg-indigo-700">
                    Get Started Free <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="glass-button !px-8 !py-4 text-lg bg-white/5 hover:bg-white/10">
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 pt-8 border-t border-white/5"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-slate-950" alt="User" />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-indigo-400">2,000+</span> ambitious scholars
              </p>
            </motion.div>
          </div>

          {/* Right Visual (Interactive AI Avatar Concept) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="glass-card p-4 aspect-square flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:opacity-30 transition-opacity"></div>
              <Brain size={200} className="text-indigo-500/40 animate-pulse-slow" />
              
              {/* Floating elements */}
              <div className="absolute top-10 left-10 glass-card p-3 animate-float">
                <Mic2 size={24} className="text-indigo-400" />
              </div>
              <div className="absolute bottom-20 right-10 glass-card p-3 animate-float animation-delay-2000">
                <BarChart3 size={24} className="text-purple-400" />
              </div>
              <div className="absolute top-1/2 -right-4 glass-card p-3 animate-float animation-delay-4000">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-amber-400" />}
            title="Dynamic AI Generation"
            desc="Llama 3 powered questions that adapt to your skill level and subject choice in real-time."
          />
          <FeatureCard 
            icon={<Mic2 className="text-blue-400" />}
            title="Voice Intelligence"
            desc="Speak naturally. Our platform listens, transcribes, and responds using advanced Web Speech APIs."
          />
          <FeatureCard 
            icon={<BarChart3 className="text-purple-400" />}
            title="Mentor Insights"
            desc="Detailed performance reviews covering technical accuracy, confidence, and communication."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card p-8 border-none bg-white/5 hover:bg-white/[0.08] transition-colors"
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);
