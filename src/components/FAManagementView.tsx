import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, Edit3, Trash2, Plus, PieChart, Mail } from 'lucide-react';
import { BioProject } from '../types';
import { useProject } from '../contexts/ProjectContext';

const FAManagementView = ({ 
  onCreateProject, 
  onEditProject, 
  onDeleteProject,
  requests,
  inquiries,
  onApproveRequest,
  onDenyRequest
}: { 
  onCreateProject: () => void,
  onEditProject: (p: BioProject) => void,
  onDeleteProject: (id: string) => void,
  requests: any[],
  inquiries: any[],
  onApproveRequest: (id: string) => void,
  onDenyRequest: (id: string) => void
}) => {
  const { projects, approveProject, rejectProject } = useProject();
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
                    onClick={() => approveProject(project.id)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectProject(project.id)}
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

export default FAManagementView;