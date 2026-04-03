import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { TherapeuticArea, UserRole, UserProfile } from '../types';
import { logout } from '../firebase';

const AREAS: TherapeuticArea[] = ['Oncology', 'Neurology', 'Cardiovascular', 'Infectious Diseases', 'Rare Diseases', 'Immunology'];

const AREA_LABELS: Record<TherapeuticArea, string> = {
  'Oncology': 'Oncology',
  'Neurology': 'Neurology',
  'Cardiovascular': 'Cardiovascular',
  'Infectious Diseases': 'Infectious Diseases',
  'Rare Diseases': 'Rare Diseases',
  'Immunology': 'Immunology'
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

export default Sidebar;