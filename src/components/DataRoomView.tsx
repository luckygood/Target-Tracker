import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, Download, FileText, FileSpreadsheet, Presentation, FileCode } from 'lucide-react';
import { BioProject, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

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

export default DataRoomView;