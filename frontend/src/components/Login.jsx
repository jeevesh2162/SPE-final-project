import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from "../useContext.jsx";
import { loginUser } from '../api/userApi';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await loginUser(formData);
      if (response && response.body) {
        localStorage.setItem('loggedinuser', JSON.stringify(response.body));
        setUser(formData);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message === 'Invalid credentials' 
        ? 'Invalid email or password. Please check your credentials.' 
        : error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-400">Continue your journey to interview mastery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={18} /> {errorMessage}
            </motion.div>
          )}

          <button 
            type="submit" 
            className="w-full glass-button !py-4 flex items-center justify-center gap-3 text-lg bg-indigo-600 border-none hover:bg-indigo-700 mt-8"
          >
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account? 
            <Link to="/signup" className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
