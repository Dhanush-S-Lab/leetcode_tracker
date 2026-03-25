import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ProblemTable = ({ results }) => {
  return (
    <div className="glass-card overflow-hidden border-white/[0.05]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header">Problem Name</th>
              <th className="table-header">Difficulty</th>
              <th className="table-header text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index} className="table-row group">
                <td className="px-6 py-6 font-bold text-slate-200 group-hover:text-white transition-colors">
                  {item.title}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {item.difficulty}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex justify-center">
                    {item.status === 'Solved' ? (
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-4 py-2 rounded-xl border border-emerald-400/10">
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Solved</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400 bg-rose-400/5 px-4 py-2 rounded-xl border border-rose-400/10">
                        <XCircle size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Not Solved</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemTable;
