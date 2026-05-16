import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Book, Sparkles, CheckCircle2, Camera, User, Video as VideoIcon, Send } from "lucide-react";
import { Video } from "./video.jsx";
import { useInterview } from "../hooks/useInterview";

export const SpeechToText = () => {
  const videoRef = useRef(null);
  const [topicInput, setTopicInput] = useState("");
  const {
    messages,
    isListening,
    isInterviewActive,
    isAnswering,
    inputSubmitted,
    isProcessing,
    isEvaluating,
    questionCount,
    answerCount,
    canEndInterview,
    errorMessage,
    startAnswer,
    finishAnswer,
    startInterview,
    endInterview,
    interviewTopic
  } = useInterview();

  const handleStart = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      startInterview(topicInput);
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <AnimatePresence mode="wait">
        {!inputSubmitted ? (
          <motion.div
            key="input-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl glass-card p-12 relative z-10"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Begin Your Session</h2>
              <p className="text-slate-400">Enter a topic to generate your customized interview questions.</p>
            </div>

            <form onSubmit={handleStart} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 block">
                  Interview Subject / Topic
                </label>
                <div className="relative">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. React.js, System Design, Behavioral..."
                    className="glass-input w-full pl-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className="glass-button !py-2 !px-2 text-xs bg-white/5 border-white/10 hover:border-indigo-500/50"
                  >
                    {level}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!topicInput.trim() || isProcessing}
                className="w-full glass-button !py-4 bg-indigo-600 border-none hover:bg-indigo-700 flex items-center justify-center gap-3 text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
                Commence Interview
              </button>

              {errorMessage && (
                <p className="text-sm text-red-400 text-center mt-4" role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="interview-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
          >
            {/* Sidebar: Mentor & Camera */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* AI Avatar Card */}
              <div className="glass-card p-6 flex flex-col items-center">
                <div className="w-full aspect-square glass-card bg-indigo-500/10 mb-6 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20"></div>
                  
                  {/* Animated Avatar Placeholder */}
                  <motion.div
                    animate={isProcessing ? { 
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative flex flex-col items-center"
                  >
                    <div className="w-32 h-32 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                      <User size={64} className="text-indigo-400" />
                    </div>
                    {isProcessing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-widest shadow-lg"
                      >
                        Speaking
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">AI Scholar Mentor</h3>
                <p className="text-xs text-indigo-400 uppercase tracking-[0.2em] font-medium">Interviewing Mode</p>
              </div>

              {/* Camera Preview */}
              <div className="glass-card p-2 bg-slate-950/50 relative overflow-hidden aspect-video">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live Preview</span>
                </div>
                <Video ref={videoRef} isActive={isInterviewActive} />
              </div>

              {/* Controls */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Controls</span>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{answerCount}/6 Answers</span>
                </div>
                
                <button
                  onClick={startAnswer}
                  disabled={isAnswering || isProcessing || isEvaluating}
                  className={`w-full glass-button !py-4 flex items-center justify-center gap-3 transition-all ${
                    isAnswering ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-indigo-600 border-none hover:bg-indigo-700'
                  }`}
                >
                  <Mic size={20} className={isAnswering ? 'animate-pulse text-indigo-400' : ''} />
                  {isAnswering ? 'Recording...' : 'Answer Question'}
                </button>

                <button
                  onClick={finishAnswer}
                  disabled={!isAnswering || isProcessing || isEvaluating}
                  className="w-full glass-button !py-4 flex items-center justify-center gap-3 border-white/10 hover:border-white/30"
                >
                  <CheckCircle2 size={20} /> Finish Answer
                </button>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={endInterview}
                    disabled={isProcessing || isEvaluating}
                    className="w-full glass-button !py-3 flex items-center justify-center gap-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm"
                  >
                    <Square size={16} /> {isEvaluating ? "Evaluating..." : "End Session"}
                  </button>
                  {!canEndInterview && (
                    <p className="text-[10px] text-red-500/70 text-center mt-3 uppercase tracking-widest">
                      Complete 6 answers to unlock evaluation
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main: Transcript / Chat */}
            <div className="lg:col-span-8 glass-card bg-slate-950/30 flex flex-col h-[800px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Book size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{interviewTopic}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Session Transcript</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {isAnswering ? "Voice Active" : "Interviewer Ready"}
                  </span>
                </div>
              </div>

              {/* Chat Content */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'question' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] flex flex-col ${msg.type === 'question' ? 'items-start' : 'items-end'}`}>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          {msg.type === 'question' ? <Sparkles size={12} className="text-indigo-400" /> : <Mic size={12} className="text-purple-400" />}
                          {msg.type === 'question' ? 'AI Mentor' : 'Scholar'}
                        </span>
                        <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                          msg.type === 'question' 
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-none' 
                          : 'bg-white/5 border border-white/10 text-slate-300 rounded-tr-none italic'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {(isProcessing || isEvaluating) && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex items-center gap-3 text-indigo-400/60 font-medium text-xs bg-indigo-500/5 w-fit px-4 py-2 rounded-full border border-indigo-500/10"
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>{isEvaluating ? "Analyzing your performance..." : "Scholar Mentor is thinking..."}</span>
                  </motion.div>
                )}
              </div>
              
              {/* Chat Footer / Status */}
              <div className="p-6 border-t border-white/5 bg-slate-950/20">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-4 text-slate-500">
                    <Mic size={18} className={isListening ? 'text-indigo-400' : ''} />
                    <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={isListening ? { x: [-256, 0] } : { x: -256 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
