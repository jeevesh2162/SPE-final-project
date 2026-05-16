import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../api/userApi";
import { UserPlus, User, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
      await registerUser(formData);
      alert("Account created successfully. Please sign in.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card p-10 relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
          <p className="text-slate-400">Join thousands of scholars mastering their interview skills.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User size={16} className="text-indigo-400" /> Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="John Doe"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Mail size={16} className="text-indigo-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Lock size={16} className="text-indigo-400" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3 text-sm text-indigo-300">
            <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            <p>By creating an account, you agree to our terms and conditions for ethical AI interview practice.</p>
          </div>

          <button 
            type="submit" 
            className="w-full glass-button !py-4 flex items-center justify-center gap-3 text-lg bg-indigo-600 border-none hover:bg-indigo-700 mt-4"
          >
            <UserPlus size={20} /> Create Account
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account? 
            <Link to="/login" className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
