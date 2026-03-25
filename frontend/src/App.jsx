import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, TrendingUp, AlertCircle, Code2, Settings } from 'lucide-react';
import SearchBox from './components/SearchBox';
import StatCard from './components/StatCard';
import ProblemTable from './components/ProblemTable';
import UploadProblems from './components/UploadProblems';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const fetchStatus = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/check/${username}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex justify-end mb-8 relative z-20">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-slate-300 font-medium"
          >
            <Settings size={18} />
            <span>{showSettings ? 'Back to Tracker' : 'Manage Problems'}</span>
          </button>
        </div>

        <motion.header 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-5 bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-3xl mb-8 shadow-2xl">
            <Code2 size={48} className="text-primary animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
              LeetCode
            </span>
            <br />
            <span className="text-primary italic tracking-normal">Tracker</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto leading-relaxed opacity-80">
            Advanced real-time verification system for monitored problem solving performance.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {showSettings ? (
            <UploadProblems key="settings" onBack={() => setShowSettings(false)} />
          ) : (
            <motion.div 
              key="tracker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SearchBox 
                username={username} 
                setUsername={setUsername} 
                onSearch={fetchStatus} 
                isLoading={loading} 
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 border-rose-500/20 bg-rose-500/5 text-rose-500 flex items-center gap-3 mb-10 max-w-2xl mx-auto"
                >
                  <AlertCircle size={20} />
                  <p className="font-semibold">{error}</p>
                </motion.div>
              )}

              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <div className="flex flex-wrap gap-6">
                    <StatCard 
                      title="Total Solved" 
                      value={`${data.solved} / ${data.total}`} 
                      icon={Target} 
                      color="primary" 
                    />
                    <StatCard 
                      title="Completion" 
                      value={`${data.percentage}%`} 
                      icon={TrendingUp} 
                      color="accent" 
                    />
                    <StatCard 
                      title="Student" 
                      value={data.username} 
                      icon={Trophy} 
                      color="secondary" 
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                      <h2 className="text-2xl font-black text-slate-200 tracking-tight">Assignment Breakdown</h2>
                      <span className="text-sm text-slate-400 font-medium">Showing last accepted submissions</span>
                    </div>
                    <ProblemTable results={data.results} />
                  </div>
                </motion.div>
              )}

              {!data && !loading && !error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="text-center py-20 text-slate-500"
                >
                  <Trophy size={80} className="mx-auto mb-6 opacity-20" />
                  <p className="text-lg font-medium">Enter a username above to see their progress.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
