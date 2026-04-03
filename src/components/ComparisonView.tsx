import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { BioProject } from '../types';

const STAGE_LABELS: Record<string, string> = {
  'Pre-clinical': 'Pre-clinical',
  'Phase I': 'Phase I',
  'Phase II': 'Phase II',
  'Phase III': 'Phase III',
  'Approved': 'Approved'
};

const AREA_LABELS: Record<string, string> = {
  'Oncology': 'Oncology',
  'Neurology': 'Neurology',
  'Cardiovascular': 'Cardiovascular',
  'Infectious Diseases': 'Infectious Diseases',
  'Rare Diseases': 'Rare Diseases',
  'Immunology': 'Immunology'
};

const ComparisonView = ({ projects, onBack }: { projects: BioProject[], onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 bg-white z-[80] flex flex-col"
    >
      <div className="h-12 flex items-center px-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <button onClick={onBack} className="text-emerald-600 font-medium flex items-center gap-1">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-slate-900">Comparison</div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b border-slate-100 text-left text-[10px] font-bold text-slate-400 uppercase w-32">Metric</th>
              {projects.map(p => (
                <th key={p.id} className="p-2 border-b border-slate-100 text-left min-w-[150px]">
                  <div className="text-xs font-bold text-slate-900">{p.title}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">{p.code}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600">
            <tr>
              <td className="p-2 border-b border-slate-50 font-bold bg-slate-50/50">Stage</td>
              {projects.map(p => <td key={p.id} className="p-2 border-b border-slate-50">{STAGE_LABELS[p.stage]}</td>)}
            </tr>
            <tr>
              <td className="p-2 border-b border-slate-50 font-bold bg-slate-50/50">Area</td>
              {projects.map(p => <td key={p.id} className="p-2 border-b border-slate-50">{AREA_LABELS[p.area]}</td>)}
            </tr>
            <tr>
              <td className="p-2 border-b border-slate-50 font-bold bg-slate-50/50">Status</td>
              {projects.map(p => <td key={p.id} className="p-2 border-b border-slate-50">{p.partneringStatus}</td>)}
            </tr>
            <tr>
              <td className="p-2 border-b border-slate-50 font-bold bg-slate-50/50 align-top">Collaboration</td>
              {projects.map(p => (
                <td key={p.id} className="p-2 border-b border-slate-50">
                  <div className="flex flex-wrap gap-1">
                    {p.collaborationModels?.map((m, i) => (
                      <span key={i} className="bg-slate-100 text-[9px] px-1.5 py-0.5 rounded text-slate-600 font-medium">{m}</span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 border-b border-slate-50 font-bold bg-slate-50/50 align-top">Key Data</td>
              {projects.map(p => (
                <td key={p.id} className="p-2 border-b border-slate-50">
                  <ul className="list-disc pl-4 space-y-1">
                    {p.keyData?.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonView;