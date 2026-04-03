import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BioProject, TherapeuticArea, DevelopmentStage, UserProfile } from '../types';

const STAGES: DevelopmentStage[] = ['Pre-clinical', 'Phase I', 'Phase II', 'Phase III', 'Approved'];
const AREAS: TherapeuticArea[] = ['Oncology', 'Neurology', 'Cardiovascular', 'Infectious Diseases', 'Rare Diseases', 'Immunology'];
const COLLABORATION_MODELS = ['Out-licensing', 'Strategic Partnership', 'Joint Development', 'Equity Investment', 'Regional Rights', 'Global Rights', 'Commercial Partnership', 'Distribution Rights'];

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project = null,
  userProfile,
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  project?: BioProject | null,
  userProfile: UserProfile | null,
  onSave: (project: BioProject) => Promise<void>
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{project ? 'Edit Project' : 'New Project'}</h2>
        <p className="text-slate-500 text-sm mb-6">
          {project ? 'Update project details in the pipeline.' : 'Enter project details to add to the pipeline.'}
        </p>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const formData = new FormData(e.currentTarget);
          const title = formData.get('title') as string;
          const code = formData.get('code') as string;
          const description = formData.get('description') as string;
          const technicalIntroduction = formData.get('technicalIntroduction') as string;
          const target = formData.get('target') as string;
          const indication = formData.get('indication') as string;
          const modality = formData.get('modality') as string;
          const ipStatus = formData.get('ipStatus') as string;
          const competitiveLandscape = formData.get('competitiveLandscape') as string;
          const area = formData.get('area') as TherapeuticArea;
          const stage = formData.get('stage') as DevelopmentStage;
          const collaborationModels = formData.getAll('collaborationModels') as string[];
          
          if (!title || !code || !description) {
            setIsSubmitting(false);
            return;
          }

          const projectData: BioProject = {
            id: project?.id || crypto.randomUUID(),
            title,
            code,
            stage,
            area,
            description,
            technicalIntroduction: technicalIntroduction || description,
            target: target || 'TBD',
            indication: indication || area,
            modality: modality || 'TBD',
            ipStatus: ipStatus || 'Pending',
            competitiveLandscape: competitiveLandscape || 'Competitive landscape analysis pending...',
            collaborationModels,
            imageUrl: project?.imageUrl || `https://picsum.photos/seed/${area.toLowerCase()}/800/600`,
            partneringStatus: project?.partneringStatus || 'Open',
            projectStatus: project?.projectStatus || 'On Track',
            reviewStatus: project?.reviewStatus || 'Pending',
            keyData: project?.keyData || ['Initial data point'],
            background: project?.background || 'Project background details...',
            coreTechnology: project?.coreTechnology || 'Core technology description...',
            researchProgress: project?.researchProgress || 'Current research status...',
            mechanismOfAction: project?.mechanismOfAction || 'Mechanism of action description...',
            potentialApplications: project?.potentialApplications || ['Application 1'],
            milestones: project?.milestones || [
              { id: 'm-init', title: 'Project Kickoff', date: new Date().toISOString().split('T')[0], status: 'Completed' }
            ],
            contact: project?.contact || {
              name: userProfile?.displayName || 'Unknown',
              position: 'Project Lead',
              linkedin: '#'
            },
            dataRoomFiles: project?.dataRoomFiles || []
          };

          try {
            await onSave(projectData);
            onClose();
          } finally {
            setIsSubmitting(false);
          }
        }} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Project Title</label>
            <input name="title" required defaultValue={project?.title} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. Novel CAR-T Therapy" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Project Code</label>
            <input name="code" required defaultValue={project?.code} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. TT-101" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
            <textarea name="description" required defaultValue={project?.description} rows={3} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" placeholder="Brief overview of the project..." />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Technical Introduction</label>
            <textarea name="technicalIntroduction" defaultValue={project?.technicalIntroduction} rows={2} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" placeholder="Summary of technical innovation..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Target</label>
              <input name="target" defaultValue={project?.target} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. HER2" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Modality</label>
              <input name="modality" defaultValue={project?.modality} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. Antibody" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Indication</label>
            <input name="indication" defaultValue={project?.indication} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. Breast Cancer" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">IP Status</label>
            <input name="ipStatus" defaultValue={project?.ipStatus} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="e.g. Granted US Patent" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Competitive Landscape</label>
            <textarea name="competitiveLandscape" defaultValue={project?.competitiveLandscape} rows={2} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" placeholder="Describe the project's position in the field..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Therapeutic Area</label>
              <select name="area" defaultValue={project?.area} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Stage</label>
              <select name="stage" defaultValue={project?.stage} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Collaboration Models</label>
            <div className="grid grid-cols-2 gap-2">
              {COLLABORATION_MODELS.map(model => (
                <label key={model} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" name="collaborationModels" value={model} defaultChecked={project?.collaborationModels.includes(model)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20" />
                  <span className="text-[11px] font-medium text-slate-600">{model}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl active:scale-95 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all disabled:opacity-50">
              {isSubmitting ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectModal;