import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Download, Award, Target, MessageSquare, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

export const ResultsData = () => {
  const { id } = useParams();
  const location = useLocation();
  const topicData = location.state?.topic;
  const messages = topicData?.interviewData || [];
  const evaluation = topicData?.evaluation || {};
  
  const mentorComments = Array.isArray(evaluation.mentorComments) ? evaluation.mentorComments : [];
  const strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : [];
  const weaknesses = Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [];

  const transcriptRows = [];
  let currentQuestion = null;

  messages.forEach((msg) => {
    if (!msg || !msg.text) return;

    if (msg.type === "question") {
      currentQuestion = msg.text;
      return;
    }

    if (msg.type === "response" && currentQuestion) {
      transcriptRows.push({
        question: currentQuestion,
        answer: msg.text,
      });
      currentQuestion = null;
    }
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="mb-12 flex justify-between items-center relative z-10">
        <Link 
          to="/results" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to Archives
        </Link>
        <button className="glass-button !py-2 !px-4 text-xs flex items-center gap-2">
          <Download size={14} /> Export PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        {/* Left: Summary & Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-indigo-500/20">
              <span className="text-3xl font-bold text-indigo-400">{evaluation.overallScore || '—'}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Overall Score</h2>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Scholar Performance</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" /> Key Strengths
            </h3>
            <ul className="space-y-4">
              {strengths.length > 0 ? strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  {s}
                </li>
              )) : <li className="text-slate-500 italic text-sm">No specific strengths noted.</li>}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingDown size={16} className="text-rose-400" /> Growth Areas
            </h3>
            <ul className="space-y-4">
              {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <Target size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  {w}
                </li>
              )) : <li className="text-slate-500 italic text-sm">No major growth areas noted.</li>}
            </ul>
          </motion.div>
        </div>

        {/* Right: Transcript & Details */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10"
          >
            <header className="mb-12 border-b border-white/5 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{id}</h1>
                  <p className="text-sm text-slate-500">{new Date(topicData?.date).toLocaleDateString()} • {transcriptRows.length} Pairs Exchanged</p>
                </div>
                <Award className="text-indigo-400" size={40} />
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "{evaluation.overallReview || "Evaluation for this session is still processing or unavailable."}"
              </p>
            </header>

            <div className="space-y-12">
              {transcriptRows.map((row, index) => {
                const comment = mentorComments.find(c => c.aspect?.toLowerCase().includes('technical') || index === 0); // Simplified matching for demo
                
                return (
                  <div key={index} className="space-y-6 pb-8 border-b border-white/5 last:border-0">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Question {index + 1}</span>
                      <p className="text-lg font-medium text-slate-200">{row.question}</p>
                    </div>
                    <div className="space-y-2 pl-6 border-l-2 border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Response</span>
                      <p className="text-slate-400 text-sm italic">"{row.answer}"</p>
                    </div>
                    
                    {/* Specific Mentor Comment if available */}
                    {mentorComments[index] && (
                      <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={12} /> Mentor Feedback
                          </span>
                          <span className="text-[10px] font-bold text-indigo-400">{mentorComments[index].score}/10</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {mentorComments[index].comment || mentorComments[index].aspect + ": " + mentorComments[index].comment}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
