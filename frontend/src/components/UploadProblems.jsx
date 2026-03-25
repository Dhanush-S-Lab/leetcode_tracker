import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Info, Download } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UploadProblems = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentProblems, setCurrentProblems] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/problems`);
      setCurrentProblems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8,title,slug,difficulty\nTwo Sum,two-sum,Easy\nAdd Two Numbers,add-two-numbers,Medium\nMedian of Two Sorted Arrays,median-of-two-sorted-arrays,Hard";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample-leetcode-problems.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/problems/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: res.data.message });
      setCurrentProblems(res.data.problems);
      setFile(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Upload failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-8 relative z-10 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Manage Problems
        </h2>
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-slate-200">Upload Problem List</h3>
          <p className="text-slate-400 text-sm mb-6">
            Upload an Excel (.xlsx) or CSV file with the following columns: <br/>
            <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-1 rounded">title</span>, 
            <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-1 rounded">slug</span>, 
            <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-1 rounded">difficulty</span>
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                required
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                file ? 'border-primary bg-primary/5' : 'border-white/10 group-hover:border-primary/50 group-hover:bg-white/[0.02]'
              }`}>
                <FileSpreadsheet className={`mx-auto mb-3 ${file ? 'text-primary' : 'text-slate-500'}`} size={32} />
                <p className="font-bold text-slate-300">{file ? file.name : 'Drag & Drop or Click to Select File'}</p>
                <p className="text-slate-500 text-sm mt-1">Supports .xlsx and .csv</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full flex justify-center items-center gap-2 mt-4"
              disabled={loading || !file}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              Upload & Overwrite
            </button>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-semibold text-sm">{message.text}</span>
            </motion.div>
          )}

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
              <Info size={18} /> How to find Title & Slug?
            </h4>
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              Go to a LeetCode problem page. The <strong>Title</strong> is the name of the problem. 
              The <strong>Slug</strong> is the last part of the URL.
            </p>
            <div className="bg-black/30 p-3 rounded-xl text-xs font-mono text-slate-400 break-all border border-white/5">
              https://leetcode.com/problems/<span className="text-emerald-400 font-bold">two-sum</span>/
              <br />
              <div className="mt-2 text-slate-300">
                Title: <span className="text-primary">Two Sum</span> <br />
                Slug: <span className="text-emerald-400">two-sum</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleDownloadSample}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-accent hover:text-white transition-colors"
            >
              <Download size={16} /> Download Sample CSV
            </button>
          </div>
        </div>

        {/* Current Problems Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-slate-200">Currently Tracked ({currentProblems.length})</h3>
          
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden h-[400px] flex flex-col">
            {fetchLoading ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : currentProblems.length === 0 ? (
              <div className="flex-1 flex justify-center items-center text-slate-500 p-8 text-center">
                No problems currently tracked. Please upload a file.
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                {currentProblems.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-white/[0.05] rounded-xl transition-colors">
                    <div>
                      <p className="font-bold text-sm text-slate-200">{p.title}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{p.slug}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${
                      p.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      p.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadProblems;
