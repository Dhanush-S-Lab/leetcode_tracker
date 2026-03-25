import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover p-8 flex items-center gap-6 flex-1 min-w-[280px]"
    >
      <div className={`p-4 rounded-2xl bg-${color}/10 text-${color} shadow-inner`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
