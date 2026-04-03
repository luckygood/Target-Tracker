import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Star,
  Clock,
  Share2,
  BarChart3,
  Users,
  Plus,
  Trash2,
  Edit3,
  LayoutGrid,
  Handshake,
  Trophy,
  Menu,
  Filter,
  ShieldAlert,
  CheckCircle2,
  LogOut,
  Linkedin
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { projects as initialProjects } from './data';
import { BioProject, TherapeuticArea, DevelopmentStage, UserRole, UserProfile } from './types';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, getDoc, getDocFromServer, addDoc, deleteDoc, query, where } from 'firebase/firestore';

// Import components
import ProjectModal from './components/ProjectModal';
import FAManagementView from './components/FAManagementView';
import InquiryModal from './components/InquiryModal';
import DataRoomView from './components/DataRoomView';
import ComparisonView from './components/ComparisonView';
import Sidebar from './components/Sidebar';
import VirtualizedProjectList from './components/VirtualizedProjectList';
import ProjectProgressChart from './components/ProjectProgressChart';

// Import contexts
import { UserProvider, useUser } from './contexts/UserContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';

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

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDataRoom, setShowDataRoom] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = React.useState<any[]>([]);
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<BioProject | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryProject, setInquiryProject] = useState<BioProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<{projectId: string, timestamp: string}[]>([]);
  const projectDetailRef = React.useRef<HTMLDivElement>(null);

  // Use context hooks
  const { userProfile, isAuthReady, isFA, signIn, signOut, setUserRole } = useUser();
  const {
    projects,
    filteredProjects,
    selectedProject,
    searchTerm,
    selectedArea,
    selectedStatus,
    setSearchTerm,
    setSelectedArea,
    setSelectedStatus,
    setSelectedProject,
    createProject,
    updateProject,
    deleteProject,
    approveProject,
    rejectProject
  } = useProject();

  const canCreateProject = isFA;

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  // Update active tab based on user role
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'fa_admin' || userProfile.role === 'fa_member') {
        setActiveTab('management');
      } else {
        setActiveTab('home');
      }
    }
  }, [userProfile]);

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
            onClick={signIn}
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

  const handleSetUserRole = async (role: UserRole) => {
    if (!userProfile) return;
    try {
      await setUserRole(role);
    } catch (error) {
      console.error('Error setting user role:', error);
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
    <div className="min-h-screen bg-slate-50">
      {/* Responsive Container */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Dna className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Target Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">{userProfile?.displayName}</span>
            <button onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden h-12 flex items-center justify-between px-8 pt-2 z-50 bg-white/80 backdrop-blur-md sticky top-0">
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
        <div className="flex flex-col md:flex-row">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-64 border-r border-slate-100 bg-white h-screen sticky top-16">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isFA={isFA} 
              userProfile={userProfile}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pb-24 scroll-smooth md:px-8 md:py-6">
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

                      {/* 6. Progress Visualization */}
                      <section>
                        <ProjectProgressChart project={selectedProject} />
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

                {/* Virtualized Project List */}
                <VirtualizedProjectList
                  projects={projects}
                  onProjectClick={handleProjectClick}
                  onToggleSave={toggleSaveProject}
                  onToggleCompare={toggleCompare}
                  savedProjects={savedProjects}
                  compareList={compareList}
                  selectedArea={selectedArea}
                  selectedStatus={selectedStatus}
                  searchTerm={searchTerm}
                  isFA={isFA}
                />
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
                onCreateProject={() => setShowCreateModal(true)}
                onEditProject={(p) => { setEditingProject(p); setShowEditModal(true); }}
                onDeleteProject={deleteProject}
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

          {/* iOS Bottom Tab Bar - Mobile Only */}
          <div className="md:hidden h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 pb-4 sticky bottom-0 z-[100]">
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

          {/* iOS Home Indicator - Mobile Only */}
          <div className="md:hidden absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900/10 rounded-full z-[110]" />

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
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </UserProvider>
  );
}

