import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BioProject } from '../types';

const InquiryModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onSend 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  project: BioProject | null,
  onSend: (message: string) => Promise<void>
}) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  if (!project) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a professional inquiry message for a potential partner interested in the following biomedical project:
        Title: ${project.title}
        Code: ${project.code}
        Description: ${project.description}
        Stage: ${project.stage}
        Area: ${project.area}
        
        The message should be professional, concise, and express interest in learning more about the project and potential collaboration opportunities.`,
      });
      if (response.text) {
        setMessage(response.text.trim());
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate inquiry message.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await onSend(message);
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Project Inquiry</h2>
                <p className="text-slate-500 text-sm truncate max-w-[200px]">{project.title}</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your inquiry here..."
                  className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 bg-emerald-100 text-emerald-600 px-3 py-2 rounded-xl hover:bg-emerald-200 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  AI Generate
                </button>
              </div>

              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;