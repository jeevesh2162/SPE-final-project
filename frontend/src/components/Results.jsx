import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, BookOpen, ChevronRight, FileText, Search, History, Calendar } from "lucide-react";
import { results } from "../api/userApi.jsx";

export const Results = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const fetchedTopics = await results();
        setTopics(Array.isArray(fetchedTopics) ? fetchedTopics : []);
      } catch (error) {
        console.error("Error fetching archives:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredTopics = topics.filter(t => 
    t.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10"
      >
        <div>
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <History size={24} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Learning History</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Interview Archives</h2>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full pl-12 !py-2.5 text-sm"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Retrieving your manuscripts...</p>
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group glass-card p-6 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                {topic.evaluation && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Award size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Evaluated</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {topic.topic}
              </h3>
              
              <div className="flex items-center gap-4 text-slate-500 text-xs mb-8">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(topic.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText size={14} />
                  {topic.interviewData?.length || 0} Exchanged
                </div>
              </div>

              <Link
                to={`/results/${topic.topic}`}
                state={{ topic }}
                className="w-full glass-button !py-2.5 flex items-center justify-center gap-2 text-xs font-bold"
              >
                Review Transcript <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 glass-card bg-white/5 border-dashed border-white/10"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
            <History size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No Archives Found</h3>
          <p className="text-slate-500 mb-8">You haven't completed any interview sessions yet.</p>
          <Link to="/speechToText" className="glass-button !px-8">Start Your First Session</Link>
        </motion.div>
      )}
    </div>
  );
};
