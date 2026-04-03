export type DevelopmentStage = 'Pre-clinical' | 'Phase I' | 'Phase II' | 'Phase III' | 'Approved';

export type TherapeuticArea = 'Oncology' | 'Neurology' | 'Cardiovascular' | 'Infectious Diseases' | 'Rare Diseases' | 'Immunology';

export interface DataRoomFile {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'docx' | 'pptx';
  size: string;
  category: 'Clinical' | 'Regulatory' | 'IP' | 'CMC' | 'Commercial';
  lastUpdated: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface BioProject {
  id: string;
  title: string;
  code: string; // e.g., BP-101
  description: string;
  stage: DevelopmentStage;
  area: TherapeuticArea;
  mechanismOfAction: string;
  keyData: string[];
  partneringStatus: 'Open' | 'Under Negotiation' | 'Closed';
  projectStatus: 'On Track' | 'Delayed' | 'On Hold' | 'Accelerated';
  reviewStatus: ReviewStatus;
  imageUrl: string;
  // Technical Details
  technicalIntroduction: string;
  target: string;
  indication: string;
  modality: string;
  ipStatus: string;
  competitiveLandscape: string;
  background: string;
  coreTechnology: string;
  researchProgress: string;
  potentialApplications: string[];
  // Milestones & Team
  milestones: Milestone[];
  // Data Room
  dataRoomFiles: DataRoomFile[];
  collaborationModels: string[];
  contact: {
    name: string;
    position: string;
    linkedin: string;
  };
}

export type UserRole = 'fa_admin' | 'fa_member' | 'client_user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
}
