import React, { useState, useMemo, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Dna, 
  Microscope, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Mail,
  Info,
  Layers,
  FlaskConical,
  Home,
  Briefcase,
  User,
  Settings,
  Battery,
  Wifi,
  Signal,
  Lock,
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  CheckCircle2,
  Linkedin,
  Menu,
  X,
  Filter,
  ShieldAlert,
  LogOut,
  AlertCircle,
  Star,
  Clock,
  Share2,
  BarChart3,
  Users,
  PieChart,
  Plus,
  Trash2,
  Edit3,
  LayoutGrid,
  Handshake,
  Trophy,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { projects as initialProjects } from './data';
import { BioProject, TherapeuticArea, DevelopmentStage, DataRoomFile, UserRole, UserProfile } from './types';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, getDoc, getDocFromServer, addDoc, deleteDoc, query, where } from 'firebase/firestore';

// Error Boundary Component
// (Removed due to TS issues)

const STAGES: DevelopmentStage[] = ['Pre-clinical', 'Phase I', 'Phase II', 'Phase III', 'Approved'];
const AREAS: TherapeuticArea[] = ['Oncology', 'Neurology', 'Cardiovascular', 'Infectious Diseases', 'Rare Diseases', 'Immunology'];
const COLLABORATION_MODELS = ['Out-licensing', 'Strategic Partnership', 'Joint Development', 'Equity Investment', 'Regional Rights', 'Global Rights', 'Commercial Partnership', 'Distribution Rights'];

const STAGE_LABELS: Record<DevelopmentStage, string> = {
  'Pre-clinical': 'Pre-clinical',
  'Phase I': 'Phase I',
  'Phase II': 'Phase II',
  'Phase III': 'Phase III',
  'Approved': 'Approved'
};

const AREA_LABELS: Record<TherapeuticArea, string> = {
  'Oncology': 'Oncology',
  'Neurology': 'Neurology',
  'Cardiovascular': 'Cardiovascular',
  'Infectious Diseases': 'Infectious Diseases',
  'Rare Diseases': 'Rare Diseases',
  'Immunology': 'Immunology'
};

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

const FAManagementView = ({ 
  projects, 
  onCreateProject, 
  onEditProject, 
  onDeleteProject,
  onApproveProject,
  onRejectProject,
  requests,
  inquiries,
  onApproveRequest,
  onDenyRequest
}: { 
  projects: BioProject[], 
  onCreateProject: () => void,
  onEditProject: (p: BioProject) => void,
  onDeleteProject: (id: string) => void,
  onApproveProject: (id: string) => void,
  onRejectProject: (id: string) => void,
  requests: any[],
  inquiries: any[],
  onApproveRequest: (id: string) => void,
  onDenyRequest: (id: string) => void
}) => {
  const pendingProjects = projects.filter(p => p.reviewStatus === 'Pending');
  const otherProjects = projects.filter(p => p.reviewStatus !== 'Pending');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 pt-8 pb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">FA Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your biomedical portfolio</p>
        </div>
        <button 
          onClick={onCreateProject}
          className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <BarChart3 size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Projects</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <Users size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{inquiries.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Inquiries</p>
        </div>
      </div>

      {/* Pending Review Projects */}
      {pendingProjects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pending Review</h3>
            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">{pendingProjects.length} Pending</span>
          </div>
          <div className="space-y-3">
            {pendingProjects.map(project => (
              <div key={project.id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <img src={project.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{project.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{project.code}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onApproveProject(project.id)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onRejectProject(project.id)}
                    className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Management List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Inventory</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{otherProjects.length} Active</span>
        </div>
        
        <div className="space-y-3">
          {otherProjects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <img src={project.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{project.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{project.code}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    project.reviewStatus === 'Approved' ? 'text-emerald-600' : 
                    project.reviewStatus === 'Rejected' ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {project.reviewStatus}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditProject(project)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => onDeleteProject(project.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Requests */}
      <section className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Data Room Requests</h3>
        <div className="space-y-3">
          {requests.filter(r => r.status === 'pending').length > 0 ? (
            requests.filter(r => r.status === 'pending').map(request => {
              const project = projects.find(p => p.id === request.projectId);
              return (
                <div key={request.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{request.displayName || 'Anonymous User'}</p>
                      <p className="text-[10px] text-slate-500">{request.userEmail}</p>
                    </div>
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Pending</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">Requested access to: <span className="font-bold">{project?.title || 'Unknown Project'}</span></p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onApproveRequest(request.id)}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => onDenyRequest(request.id)}
                      className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-200 text-center">
              <PieChart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-[11px] text-slate-400 font-medium">No pending access requests</p>
            </div>
          )}
        </div>
      </section>

      {/* Inquiries */}
      <section className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Inquiries</h3>
        <div className="space-y-3">
          {inquiries.length > 0 ? (
            inquiries.slice(0, 5).map(inquiry => {
              const project = projects.find(p => p.id === inquiry.projectId);
              return (
                <div key={inquiry.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-slate-900">{inquiry.displayName || 'Anonymous'}</p>
                    <span className="text-[9px] text-slate-400">{new Date(inquiry.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">Re: {project?.title}</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl italic">"{inquiry.message}"</p>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-200 text-center">
              <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-[11px] text-slate-400 font-medium">No inquiries yet</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

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

const CATEGORY_LABELS: Record<string, string> = {
  'Clinical': 'Clinical',
  'Regulatory': 'Regulatory',
  'IP': 'IP',
  'CMC': 'CMC',
  'Commercial': 'Commercial'
};

const DataRoomView = ({ project, onBack, userProfile }: { project: BioProject, onBack: () => void, userProfile: UserProfile | null }) => {
  const isFA = userProfile?.role === 'fa_admin' || userProfile?.role === 'fa_member';
  const [hasAccess, setHasAccess] = React.useState(isFA);
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);

  useEffect(() => {
    if (!userProfile || isFA) return;

    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('uid', '==', userProfile.uid), where('projectId', '==', project.id));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const requestData = snapshot.docs[0].data();
        if (requestData.status === 'approved') {
          setHasAccess(true);
        } else if (requestData.status === 'pending') {
          setRequestSent(true);
        }
      }
    });

    return () => unsubscribe();
  }, [userProfile, project.id, isFA]);

  const handleRequestAccess = async () => {
    if (!userProfile) return;
    setIsRequesting(true);
    try {
      await addDoc(collection(db, 'requests'), {
        uid: userProfile.uid,
        projectId: project.id,
        status: 'pending',
        timestamp: new Date().toISOString(),
        userEmail: userProfile.email,
        displayName: userProfile.displayName
      });
      setRequestSent(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'requests');
    } finally {
      setIsRequesting(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={24} />;
      case 'xlsx': return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'pptx': return <Presentation className="text-orange-500" size={24} />;
      default: return <FileCode className="text-blue-500" size={24} />;
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-slate-50 z-[70] flex flex-col"
    >
      <div className="h-12 flex items-center px-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <button onClick={onBack} className="text-emerald-600 flex items-center font-medium">
          <ArrowLeft size={20} />
          <span>Project Details</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-slate-900">Data Room</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-emerald-900 text-xs">Secure Environment</h3>
            <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
              All documents are watermarked and access is audited. Unauthorized distribution is strictly prohibited.
            </p>
          </div>
        </div>

        {!hasAccess ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-slate-300" size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Access Restricted</h3>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed">
              This Data Room contains confidential information for {project.code}. Please request access to view documents.
            </p>
            
            {!requestSent ? (
              <button 
                onClick={handleRequestAccess}
                disabled={isRequesting}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-50 shadow-lg shadow-emerald-100"
              >
                {isRequesting ? 'Processing...' : 'Request Access'}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 size={32} />
                <span>Request Sent</span>
                <p className="text-[11px] text-slate-400 font-normal mt-2">
                  Our team will review your request within 24 hours.
                </p>
              </div>
            )}

            <button 
              onClick={() => setHasAccess(true)}
              className="mt-6 text-[10px] text-slate-200 underline"
            >
              (Demo: Bypass to view files)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents ({project.dataRoomFiles?.length || 0})</span>
              <button className="text-[10px] text-emerald-600 font-bold">Download All</button>
            </div>
            
            {project.dataRoomFiles?.map((file) => (
              <div key={file.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
                      {CATEGORY_LABELS[file.category] || file.category}
                    </span>
                    <span className="text-[9px] text-slate-400">{file.size} • {file.lastUpdated}</span>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-emerald-600 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
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

const Sidebar = ({ 
  isOpen, 
  onClose, 
  selectedArea, 
  setSelectedArea, 
  selectedStatus, 
  setSelectedStatus,
  userProfile,
  setUserRole
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  selectedArea: TherapeuticArea | 'All',
  setSelectedArea: (area: TherapeuticArea | 'All') => void,
  selectedStatus: string | 'All',
  setSelectedStatus: (status: string | 'All') => void,
  userProfile: UserProfile | null,
  setUserRole: (role: UserRole) => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[150]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Navigation</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Therapeutic Areas</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setSelectedArea('All'); onClose(); }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedArea === 'All' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    All Areas
                  </button>
                  {AREAS.map(area => (
                    <button 
                      key={area}
                      onClick={() => { setSelectedArea(area); onClose(); }}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedArea === area ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {AREA_LABELS[area]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Partnership Status</h3>
                <div className="space-y-2">
                  {['All', 'Open', 'Under Negotiation', 'Closed'].map(status => (
                    <button 
                      key={status}
                      onClick={() => { setSelectedStatus(status); onClose(); }}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedStatus === status ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} className="w-10 h-10 rounded-full" alt="Profile" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {userProfile?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{userProfile?.displayName || 'User'}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{userProfile?.role.replace('_', ' ') || 'Viewer'}</p>
                </div>
                <button onClick={logout} className="text-slate-400 hover:text-red-500">
                  <LogOut size={18} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['fa_admin', 'fa_member', 'client_user'] as UserRole[]).map(role => (
                  <button 
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`text-[9px] font-bold py-1.5 rounded-lg border transition-all ${userProfile?.role === role ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    {role.split('_')[1]?.toUpperCase() || role.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [projects, setProjects] = useState<BioProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<BioProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<TherapeuticArea | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string | 'All'>('All');
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDataRoom, setShowDataRoom] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [inquiries, setInquiries] = React.useState<any[]>([]);

  // Fetch Requests and Inquiries (Only for FA)
  useEffect(() => {
    if (!isAuthReady || !userProfile || (userProfile.role !== 'fa_admin' && userProfile.role !== 'fa_member')) return;

    const requestsRef = collection(db, 'requests');
    const inquiriesRef = collection(db, 'inquiries');

    const unsubRequests = onSnapshot(requestsRef, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubInquiries = onSnapshot(inquiriesRef, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubRequests();
      unsubInquiries();
    };
  }, [isAuthReady, userProfile]);

  const handleApproveRequest = async (id: string) => {
    try {
      await setDoc(doc(db, 'requests', id), { status: 'approved' }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };

  const handleDenyRequest = async (id: string) => {
    try {
      await setDoc(doc(db, 'requests', id), { status: 'denied' }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<BioProject | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryProject, setInquiryProject] = useState<BioProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<{projectId: string, timestamp: string}[]>([]);
  const projectDetailRef = React.useRef<HTMLDivElement>(null);

  const isFA = userProfile?.role === 'fa_admin' || userProfile?.role === 'fa_member';
  const canCreateProject = isFA;

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'projects');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
            if (profile.role === 'fa_admin' || profile.role === 'fa_member') {
              setActiveTab('management');
            } else {
              setActiveTab('home');
            }
          } else {
            // Create default profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              role: user.email === 'parrotandy@gmail.com' ? 'fa_admin' : 'client_user',
              displayName: user.displayName || '',
              photoURL: user.photoURL || ''
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Connection Test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Fetch Projects from Firestore
  useEffect(() => {
    if (!isAuthReady || !userProfile) return;

    const projectsRef = collection(db, 'projects');
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const fetchedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BioProject));
      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    // Seeding logic (Only for FA Admins)
    const seedProjects = async () => {
      if (userProfile.role !== 'fa_admin') return;
      
      try {
        for (const project of initialProjects) {
          const docRef = doc(db, 'projects', project.id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, project);
          }
        }
      } catch (error) {
        console.error("Error during seeding:", error);
      }
    };

    seedProjects();

    return () => unsubscribe();
  }, [isAuthReady, userProfile]);

  const handleSetUserRole = async (role: UserRole) => {
    if (!userProfile) return;
    const userDocRef = doc(db, 'users', userProfile.uid);
    try {
      await setDoc(userDocRef, { ...userProfile, role }, { merge: true });
      setUserProfile({ ...userProfile, role });
      
      // Update active tab based on new role
      if (role === 'fa_admin' || role === 'fa_member') {
        setActiveTab('management');
      } else {
        setActiveTab('home');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // If not admin, only show approved projects
      if (!isFA && project.reviewStatus !== 'Approved') return false;

      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = selectedArea === 'All' || project.area === selectedArea;
      const matchesStatus = selectedStatus === 'All' || project.partneringStatus === selectedStatus;
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchTerm, selectedArea, selectedStatus, projects, isFA]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-[40px] p-10 shadow-2xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Lock className="text-emerald-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Target Tracker</h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed">Secure biomedical project tracking and strategic partnership management.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
          <p className="text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">Authorized Access Only</p>
        </div>
      </div>
    );
  }

  const handleProjectClick = (project: BioProject) => {
    setSelectedProject(project);
    setShowDataRoom(false);
    // Add to recent activity
    setRecentActivity(prev => {
      const filtered = prev.filter(a => a.projectId !== project.id);
      return [{ projectId: project.id, timestamp: new Date().toISOString() }, ...filtered].slice(0, 5);
    });
  };

  const toggleSaveProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setSavedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const handleApproveProject = async (id: string) => {
    try {
      await setDoc(doc(db, 'projects', id), { reviewStatus: 'Approved' }, { merge: true });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, reviewStatus: 'Approved' } : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const handleRejectProject = async (id: string) => {
    try {
      await setDoc(doc(db, 'projects', id), { reviewStatus: 'Rejected' }, { merge: true });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, reviewStatus: 'Rejected' } : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const handleInquiry = (project: BioProject) => {
    setInquiryProject(project);
    setShowInquiryModal(true);
  };

  const handleSendInquiry = async (message: string) => {
    if (!userProfile || !inquiryProject) return;

    try {
      await addDoc(collection(db, 'inquiries'), {
        uid: userProfile.uid,
        projectId: inquiryProject.id,
        message,
        timestamp: new Date().toISOString(),
        userEmail: userProfile.email,
        displayName: userProfile.displayName
      });
      alert('Inquiry sent successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inquiries');
    }
  };

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const compareProjects = projects.filter(p => compareList.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-start md:py-10">
      {/* iOS Device Frame (Simulated for Desktop) */}
      <div className="w-full max-w-[430px] h-full md:h-[932px] bg-white md:rounded-[55px] md:shadow-2xl overflow-hidden relative flex flex-col md:border-[8px] md:border-slate-900">
        
        {/* iOS Status Bar */}
        <div className="h-12 flex items-center justify-between px-8 pt-2 z-50 bg-white/80 backdrop-blur-md sticky top-0">
          <span className="text-[15px] font-bold text-slate-900">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4 text-slate-900" />
            <Wifi className="w-4 h-4 text-slate-900" />
            <Battery className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          <AnimatePresence mode="wait">
            {activeTab === 'pipeline' && selectedProject ? (
              <motion.div
                key="detail"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 bg-white z-[60] overflow-y-auto pb-24"
              >
                {/* Detail Navigation Bar */}
                <div className="h-12 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-1 text-emerald-600 font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={(e) => toggleSaveProject(e, selectedProject.id)}
                    className={`p-2 rounded-xl transition-all ${
                      savedProjects.includes(selectedProject.id) ? 'text-amber-500' : 'text-slate-400'
                    }`}
                  >
                    <Star size={20} fill={savedProjects.includes(selectedProject.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Detail Content */}
                <div className="px-6 pt-2" ref={projectDetailRef}>
                  <div className="rounded-3xl overflow-hidden mb-6 shadow-lg shadow-slate-200 relative group">
                    <img 
                      src={selectedProject.imageUrl} 
                      alt={selectedProject.title} 
                      className="w-full h-56 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isFA && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 backdrop-blur p-2 rounded-xl text-slate-900 shadow-lg"><Edit3 size={18} /></button>
                        <button onClick={() => handleDeleteProject(selectedProject.id)} className="bg-white/90 backdrop-blur p-2 rounded-xl text-red-500 shadow-lg"><Trash2 size={18} /></button>
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        {AREA_LABELS[selectedProject.area]}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedProject.code}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-4">{selectedProject.title}</h2>
                    
                    <div className="flex gap-2 mb-6">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                        {STAGE_LABELS[selectedProject.stage]}
                      </span>
                      <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                        {selectedProject.partneringStatus}
                      </span>
                    </div>

                    <div className="space-y-8">
                      {/* 1. Scientific & Technical Profile */}
                      <section className="bg-emerald-50/50 rounded-[32px] p-6 border border-emerald-100/50">
                        <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <FlaskConical size={14} />
                          Scientific Profile
                        </h4>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Summary</p>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{selectedProject.technicalIntroduction}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-emerald-100/30 pt-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target</p>
                              <p className="text-sm font-bold text-slate-900">{selectedProject.target}</p>
                            </div>
                            
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Indication</p>
                              <p className="text-sm font-bold text-slate-900">{selectedProject.indication}</p>
                            </div>
                            
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Modality</p>
                              <p className="text-sm font-bold text-slate-900">{selectedProject.modality}</p>
                            </div>
                            
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IP Status</p>
                              <p className="text-sm font-bold text-slate-900">{selectedProject.ipStatus}</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 2. Competitive Landscape */}
                      <section className="px-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Trophy size={14} className="text-emerald-600" />
                          Competitive Landscape
                        </h4>
                        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
                          <p className="text-slate-600 text-[15px] leading-relaxed relative z-10 italic">
                            "{selectedProject.competitiveLandscape}"
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            <div className="w-4 h-px bg-emerald-200" />
                            Market Positioning
                          </div>
                        </div>
                      </section>

                      {/* 3. Project Narrative */}
                      <section className="px-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Project Narrative</h4>
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overview</p>
                            <p className="text-slate-600 text-[15px] leading-relaxed">{selectedProject.description}</p>
                          </div>
                          
                          <div className="bg-slate-50 rounded-3xl p-6 space-y-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Background & Unmet Need</p>
                              <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.background}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Core Innovation</p>
                              <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.coreTechnology}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current R&D Status</p>
                              <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.researchProgress}</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 3. Clinical Evidence & Key Data */}
                      <section className="px-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Clinical Evidence</h4>
                        <div className="grid gap-3">
                          {selectedProject.keyData.map((data, idx) => (
                            <div key={idx} className="flex gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                              <div className="bg-emerald-50 p-1.5 rounded-lg h-fit">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <p className="text-slate-700 text-sm font-medium">{data}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 4. Partnership & Assets */}
                      <section className="bg-slate-900 rounded-[32px] p-6 text-white">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <Handshake size={14} className="text-emerald-400" />
                          Partnership Assets
                        </h4>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Available Collaboration Models</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.collaborationModels?.map((model, idx) => (
                                <span key={idx} className="bg-white/10 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/10 backdrop-blur-sm">
                                  {model}
                                </span>
                              )) || <p className="text-[11px] text-slate-500 italic">No specific models listed</p>}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Data Room Access</p>
                            <button 
                              onClick={() => setShowDataRoom(true)}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                            >
                              <Lock size={18} />
                              Enter Secure Data Room
                            </button>
                          </div>
                        </div>
                      </section>

                      {/* 5. Roadmap & Team */}
                      <section className="bg-slate-50 rounded-[32px] p-6 space-y-8">
                        <div>
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-emerald-600" />
                            Development Roadmap
                          </h5>
                          
                          <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              selectedProject.projectStatus === 'On Track' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                              selectedProject.projectStatus === 'Accelerated' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                              selectedProject.projectStatus === 'Delayed' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' :
                              'bg-slate-400'
                            }`} />
                            <span className="text-sm font-bold text-slate-900">{selectedProject.projectStatus}</span>
                            <span className="text-[10px] text-slate-400 font-medium ml-auto uppercase tracking-widest">Current Status</span>
                          </div>

                          <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            {selectedProject.milestones?.map((m) => (
                              <div key={m.id} className="flex gap-4 relative">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${
                                  m.status === 'Completed' ? 'bg-emerald-600 text-white' :
                                  m.status === 'In Progress' ? 'bg-white border-2 border-emerald-600 text-emerald-600' :
                                  'bg-white border-2 border-slate-200 text-slate-300'
                                }`}>
                                  {m.status === 'Completed' ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <div className="flex justify-between items-start mb-0.5">
                                    <h6 className="text-xs font-bold text-slate-900">{m.title}</h6>
                                    <span className="text-[9px] font-bold text-slate-400">{m.date}</span>
                                  </div>
                                  <p className={`text-[10px] font-medium ${
                                    m.status === 'Completed' ? 'text-emerald-600' :
                                    m.status === 'In Progress' ? 'text-blue-600' :
                                    'text-slate-400'
                                  }`}>
                                    {m.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      {/* 6. Contact & Inquiry */}
                      <section className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Information</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{selectedProject.contact?.name || 'Unknown Contact'}</p>
                            <p className="text-[11px] text-slate-500">{selectedProject.contact?.position || 'Project Lead'}</p>
                          </div>
                          <div className="flex gap-2">
                            <a 
                              href={selectedProject.contact?.linkedin || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-100 p-3 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              <Linkedin size={20} />
                            </a>
                            <button 
                              onClick={() => handleInquiry(selectedProject)}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                            >
                              Inquiry
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Data Room Overlay */}
                  <AnimatePresence>
                    {showDataRoom && selectedProject && (
                      <DataRoomView 
                        project={selectedProject} 
                        onBack={() => setShowDataRoom(false)} 
                        userProfile={userProfile}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : activeTab === 'pipeline' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 pt-4"
              >
                {/* iOS Large Title */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Menu size={24} />
                    </button>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Target Tracker</h2>
                      <p className="text-slate-500 text-sm font-medium">Strategic Partnerships</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canCreateProject && (
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-100 transition-transform active:scale-95"
                        title="Create Project"
                      >
                        <Briefcase size={20} />
                      </button>
                    )}
                    {compareList.length > 0 && (
                      <button 
                        onClick={() => setShowComparison(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 flex items-center gap-2"
                      >
                        <Layers size={14} />
                        Compare ({compareList.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Bar (iOS Style) */}
                <div className="relative mb-6">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Pills (iOS Style) */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                  <button 
                    onClick={() => setSelectedArea('All')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedArea === 'All' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    All Areas
                  </button>
                  {AREAS.map(area => (
                    <button 
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        selectedArea === area ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {AREA_LABELS[area]}
                    </button>
                  ))}
                </div>

                {/* Project List (iOS Style Cards) */}
                <div className="space-y-4 mt-2">
                  {filteredProjects.map((project) => (
                    <motion.div 
                      key={project.id}
                      layoutId={project.id}
                      onClick={() => handleProjectClick(project)}
                      className="bg-white rounded-3xl p-5 flex flex-col gap-4 border border-slate-100 shadow-sm active:scale-[0.99] transition-all cursor-pointer group relative overflow-hidden"
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          project.partneringStatus === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          project.partneringStatus === 'Under Negotiation' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {project.partneringStatus}
                        </span>
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => toggleSaveProject(e, project.id)}
                            className={`p-1 rounded-full border transition-colors ${
                              savedProjects.includes(project.id) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-300'
                            }`}
                          >
                            <Star size={12} fill={savedProjects.includes(project.id) ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={(e) => toggleCompare(e, project.id)}
                            className={`p-1 rounded-full border transition-colors ${
                              compareList.includes(project.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                            }`}
                          >
                            <Layers size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-slate-50">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{project.code}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {STAGE_LABELS[project.stage]}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{project.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1 mb-2">{AREA_LABELS[project.area]}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                        <div className="bg-slate-50/50 rounded-xl p-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key Highlight</p>
                          <p className="text-[10px] text-slate-600 font-medium line-clamp-1">{project.keyData[0]}</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-2 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Documents</p>
                            <p className="text-[10px] text-slate-600 font-bold">{project.dataRoomFiles.length} Files</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-20">
                    <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No projects found</p>
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-6 pt-8 pb-12"
              >
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-10">
                  <div className="relative mb-4">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} className="w-24 h-24 rounded-[32px] shadow-xl border-4 border-white" alt="Profile" />
                    ) : (
                      <div className="w-24 h-24 rounded-[32px] bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold shadow-xl border-4 border-white">
                        {userProfile?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-2xl shadow-lg">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{userProfile?.displayName || 'User'}</h2>
                  <p className="text-slate-500 font-medium mb-4">{userProfile?.email}</p>
                  <div className="flex gap-2">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                      {userProfile?.role.replace('_', ' ') || 'Viewer'}
                    </span>
                    <button className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saved</p>
                      <p className="text-lg font-bold text-slate-900">{savedProjects.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Views</p>
                      <p className="text-lg font-bold text-slate-900">{recentActivity.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Inquiries</p>
                      <p className="text-lg font-bold text-slate-900">0</p>
                    </div>
                  </div>

                  {/* Saved Projects */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved Projects</h3>
                      <button className="text-[10px] text-emerald-600 font-bold">View All</button>
                    </div>
                    <div className="space-y-3">
                      {savedProjects.length > 0 ? (
                        savedProjects.map(id => {
                          const project = projects.find(p => p.id === id);
                          if (!project) return null;
                          return (
                            <div 
                              key={id} 
                              onClick={() => { setActiveTab('pipeline'); setSelectedProject(project); }}
                              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                                <img src={project.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate">{project.title}</h4>
                                <p className="text-[10px] text-slate-500">{project.code}</p>
                              </div>
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200">
                          <Star className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                          <p className="text-[11px] text-slate-400 font-medium">No saved projects yet</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Recent Activity */}
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity, idx) => {
                          const project = projects.find(p => p.id === activity.projectId);
                          if (!project) return null;
                          return (
                            <div key={idx} className="flex gap-3">
                              <div className="w-8 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  <Clock size={14} />
                                </div>
                                {idx !== recentActivity.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="text-xs font-bold text-slate-900">Viewed {project.code}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[11px] text-slate-400 font-medium text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </section>

                  {/* Account Overview */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Access Level</p>
                        <p className="text-sm font-bold text-slate-900">{userProfile?.role === 'administrator' ? 'Full Access' : 'Restricted'}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-sm font-bold text-slate-900">Mar 2026</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Mail size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Notification Settings</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <ShieldAlert size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Security & Privacy</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={logout}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-sm border border-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'home' && !isFA ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 pt-8 pb-12"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back,</h2>
                  <p className="text-emerald-600 text-lg font-bold">{userProfile?.displayName || 'User'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl">
                    <Briefcase className="w-6 h-6 mb-3 text-emerald-400" />
                    <p className="text-3xl font-bold mb-1">{projects.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Projects</p>
                  </div>
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    <Activity className="w-6 h-6 mb-3 text-blue-600" />
                    <p className="text-3xl font-bold mb-1">{projects.filter(p => p.partneringStatus === 'Under Negotiation').length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Negotiations</p>
                  </div>
                </div>

                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Featured Targets</h3>
                    <button onClick={() => setActiveTab('pipeline')} className="text-[10px] text-emerald-600 font-bold">View All</button>
                  </div>
                  <div className="space-y-4">
                    {projects.slice(0, 6).map(project => (
                      <div 
                        key={project.id}
                        onClick={() => { setActiveTab('pipeline'); setSelectedProject(project); }}
                        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex gap-4 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                          <img src={project.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{project.code}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate">{project.title}</h4>
                          <p className="text-[10px] text-slate-500">{AREA_LABELS[project.area]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                  <h3 className="text-sm font-bold text-emerald-900 mb-2">Platform Update</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    New data room features are now live. You can now request access to confidential documents directly from the project view.
                  </p>
                </div>
              </motion.div>
            ) : activeTab === 'management' && isFA ? (
              <FAManagementView 
                projects={projects} 
                onCreateProject={() => setShowCreateModal(true)}
                onEditProject={(p) => { setEditingProject(p); setShowEditModal(true); }}
                onDeleteProject={handleDeleteProject}
                onApproveProject={handleApproveProject}
                onRejectProject={handleRejectProject}
                requests={requests}
                inquiries={inquiries}
                onApproveRequest={handleApproveRequest}
                onDenyRequest={handleDenyRequest}
              />
            ) : activeTab === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="px-6 pt-8 pb-12"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Preferences</h3>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-700">Push Notifications</span>
                        <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-700">Email Updates</span>
                        <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Biometric Login</span>
                        <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Appearance</h3>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-700">Dark Mode</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">System</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">App Icon</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Default</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">About</h3>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-700">Version</span>
                        <span className="text-xs text-slate-400">2.4.0 (Build 102)</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Terms of Service</span>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="other"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 pt-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <Settings className="text-slate-300" size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                <p className="text-slate-500 text-sm">This section is currently under development.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* iOS Bottom Tab Bar */}
        <div className="h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 pb-4 sticky bottom-0 z-[100]">
          {isFA ? (
            <>
              <button 
                onClick={() => setActiveTab('management')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'management' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-[10px] font-bold">Manage</span>
              </button>
              <button 
                onClick={() => { setActiveTab('pipeline'); setSelectedProject(null); }}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'pipeline' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <LayoutGrid className="w-6 h-6" />
                <span className="text-[10px] font-bold">Pipeline</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-[10px] font-bold">Account</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button 
                onClick={() => { setActiveTab('pipeline'); setSelectedProject(null); }}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'pipeline' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <LayoutGrid className="w-6 h-6" />
                <span className="text-[10px] font-bold">Pipeline</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-[10px] font-bold">Account</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <Settings className="w-6 h-6" />
                <span className="text-[10px] font-bold">Settings</span>
              </button>
            </>
          )}
        </div>

        <AnimatePresence>
          {showComparison && (
            <ComparisonView 
              projects={compareProjects} 
              onBack={() => setShowComparison(false)} 
            />
          )}
        </AnimatePresence>

        {/* iOS Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900/10 rounded-full z-[110]" />

        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          userProfile={userProfile}
          setUserRole={handleSetUserRole}
        />

        <AnimatePresence>
          {showInquiryModal && (
            <InquiryModal
              isOpen={showInquiryModal}
              onClose={() => setShowInquiryModal(false)}
              project={inquiryProject}
              onSend={handleSendInquiry}
            />
          )}
        </AnimatePresence>

        {/* Project Modals */}
        <AnimatePresence>
          {showCreateModal && (
            <ProjectModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              userProfile={userProfile}
              onSave={async (projectData) => {
                try {
                  await setDoc(doc(db, 'projects', projectData.id), projectData);
                } catch (error) {
                  handleFirestoreError(error, OperationType.CREATE, 'projects');
                }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <ProjectModal
              isOpen={showEditModal}
              onClose={() => { setShowEditModal(false); setEditingProject(null); }}
              project={editingProject}
              userProfile={userProfile}
              onSave={async (projectData) => {
                try {
                  await setDoc(doc(db, 'projects', projectData.id), projectData, { merge: true });
                } catch (error) {
                  handleFirestoreError(error, OperationType.UPDATE, 'projects');
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

