import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../useContext.jsx";
import { Brain, LogOut, Menu, X, Award, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedinuser");
    setUser(null);
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("loggedinuser");

  return (
    <nav className="glass-nav px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-none">
              Scholar's Study
            </span>
            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-medium">
              AI Interview Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/speechToText" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Interview</Link>
              <Link to="/results" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                <History size={16} /> History
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 glass-button !py-2 !px-4 text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="glass-button !py-2 !px-5 text-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col gap-4 shadow-2xl"
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium">Home</Link>
            {isLoggedIn ? (
              <>
                <Link to="/speechToText" onClick={() => setMenuOpen(false)} className="text-lg font-medium">Interview</Link>
                <Link to="/results" onClick={() => setMenuOpen(false)} className="text-lg font-medium">History</Link>
                <button onClick={logout} className="text-left text-lg font-medium text-red-400 flex items-center gap-2">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-lg font-medium">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};