/**
 * VirtualizedProjectList Component
 * 
 * This component implements virtual scrolling for project lists to improve performance
 * when rendering large numbers of project items. It uses react-window's FixedSizeList
 * to render only the visible items, significantly reducing DOM nodes and improving
 * scrolling performance.
 *
 * @param projects - Array of BioProject objects to display
 * @param onProjectClick - Callback function when a project is clicked
 * @param onToggleSave - Callback function when save button is clicked
 * @param onToggleCompare - Callback function when compare button is clicked
 * @param savedProjects - Array of saved project IDs
 * @param compareList - Array of project IDs to compare
 * @param selectedArea - Selected therapeutic area for filtering
 * @param selectedStatus - Selected partnering status for filtering
 * @param searchTerm - Search term for filtering projects
 * @param isFA - Boolean indicating if the user is a FA (Financial Advisor)
 */
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'motion/react';
import { Star, Layers, ChevronRight } from 'lucide-react';
import { BioProject, TherapeuticArea, DevelopmentStage } from '../types';

interface VirtualizedProjectListProps {
  projects: BioProject[];
  onProjectClick: (project: BioProject) => void;
  onToggleSave: (e: React.MouseEvent, projectId: string) => void;
  onToggleCompare: (e: React.MouseEvent, projectId: string) => void;
  savedProjects: string[];
  compareList: string[];
  selectedArea: TherapeuticArea | 'All';
  selectedStatus: string | 'All';
  searchTerm: string;
  isFA: boolean;
}

const VirtualizedProjectList: React.FC<VirtualizedProjectListProps> = ({
  projects,
  onProjectClick,
  onToggleSave,
  onToggleCompare,
  savedProjects,
  compareList,
  selectedArea,
  selectedStatus,
  searchTerm,
  isFA
}) => {
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

  const filteredProjects = projects.filter(project => {
    // If not admin, only show approved projects
    if (!isFA && project.reviewStatus !== 'Approved') return false;

    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'All' || project.area === selectedArea;
    const matchesStatus = selectedStatus === 'All' || project.partneringStatus === selectedStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const ProjectItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const project = filteredProjects[index];
    if (!project) return null;

    return (
      <motion.div
        key={project.id}
        style={{
          ...style,
          marginBottom: '16px',
          padding: '0',
        }}
        layoutId={project.id}
        onClick={() => onProjectClick(project)}
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
              onClick={(e) => onToggleSave(e, project.id)}
              className={`p-1 rounded-full border transition-colors ${
                savedProjects.includes(project.id) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-300'
              }`}
            >
              <Star size={12} fill={savedProjects.includes(project.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => onToggleCompare(e, project.id)}
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
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      </motion.div>
    );
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
          <Layers size={24} />
        </div>
        <p className="text-sm font-bold text-slate-700 mb-2">No projects found</p>
        <p className="text-xs text-slate-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <List
        height={500}
        itemCount={filteredProjects.length}
        itemSize={180}
        width="100%"
        overscanCount={5}
      >
        {ProjectItem}
      </List>
    </div>
  );
};

export default VirtualizedProjectList;