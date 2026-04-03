import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { BioProject, TherapeuticArea } from '../types';
import { projects as initialProjects } from '../data';
import { useUser } from './UserContext';

interface ProjectContextType {
  projects: BioProject[];
  filteredProjects: BioProject[];
  selectedProject: BioProject | null;
  searchTerm: string;
  selectedArea: TherapeuticArea | 'All';
  selectedStatus: string | 'All';
  setSearchTerm: (term: string) => void;
  setSelectedArea: (area: TherapeuticArea | 'All') => void;
  setSelectedStatus: (status: string | 'All') => void;
  setSelectedProject: (project: BioProject | null) => void;
  createProject: (project: BioProject) => Promise<void>;
  updateProject: (project: BioProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  approveProject: (id: string) => Promise<void>;
  rejectProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<BioProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<BioProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<TherapeuticArea | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string | 'All'>('All');
  const { userProfile, isFA } = useUser();

  // Fetch Projects from Firestore
  useEffect(() => {
    if (!userProfile) return;

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
  }, [userProfile]);

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

  const createProject = async (project: BioProject) => {
    try {
      await setDoc(doc(db, 'projects', project.id), project);
      setProjects(prev => [...prev, project]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  const updateProject = async (project: BioProject) => {
    try {
      await setDoc(doc(db, 'projects', project.id), project);
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'projects');
    }
  };

  const approveProject = async (id: string) => {
    try {
      await setDoc(doc(db, 'projects', id), { reviewStatus: 'Approved' }, { merge: true });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, reviewStatus: 'Approved' } : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const rejectProject = async (id: string) => {
    try {
      await setDoc(doc(db, 'projects', id), { reviewStatus: 'Rejected' }, { merge: true });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, reviewStatus: 'Rejected' } : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const value = {
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
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};