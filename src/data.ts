import { BioProject } from './types';

export const projects: BioProject[] = [
  {
    id: '1',
    title: 'Next-Gen CAR-T Therapy for Solid Tumors',
    code: 'BP-101',
    description: 'A novel CAR-T cell therapy targeting a specific antigen overexpressed in solid tumors, designed to overcome the immunosuppressive microenvironment.',
    stage: 'Phase I',
    area: 'Oncology',
    mechanismOfAction: 'Engineered T-cells expressing a chimeric antigen receptor (CAR) with enhanced persistence and tumor infiltration capabilities.',
    keyData: [
      '80% tumor reduction in mouse models.',
      'Favorable safety profile in preliminary Phase I cohorts.',
      'Enhanced T-cell survival compared to first-gen CAR-T.'
    ],
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/oncology/800/600',
    technicalIntroduction: 'Next-generation CAR-T therapy utilizing TME-Shield technology to overcome immunosuppression in solid tumors.',
    target: 'GPC3 / Mesothelin',
    indication: 'Solid Tumors (HCC, Pancreatic, Ovarian)',
    modality: 'Cell Therapy (CAR-T)',
    ipStatus: 'Granted patents in US, EU, and China; pending applications in JP.',
    competitiveLandscape: 'While several CAR-T products exist for liquid tumors, BP-101 is positioned as a leader in solid tumors. Compared to competitors like Legend Biotech or Novartis, our TME-Shield technology provides a unique advantage in overcoming the immunosuppressive environment of the pancreas and liver.',
    background: 'Solid tumors present a significant challenge for CAR-T therapies due to the immunosuppressive tumor microenvironment (TME) and poor T-cell infiltration. Current CAR-T products are primarily effective in hematological malignancies, leaving a vast unmet need in solid oncology.',
    coreTechnology: 'Our proprietary "TME-Shield" technology incorporates a dual-targeting CAR construct and a localized cytokine secretion module that neutralizes inhibitory signals (like TGF-beta) while promoting T-cell expansion within the tumor.',
    researchProgress: 'Currently in Phase I dose-escalation study. Initial cohorts have demonstrated manageable toxicity (low-grade CRS) and early signs of antigen-specific T-cell expansion in peripheral blood and tumor biopsies.',
    potentialApplications: [
      'Metastatic Pancreatic Cancer',
      'Advanced Ovarian Cancer',
      'Refractory Colorectal Cancer'
    ],
    milestones: [
      { id: 'm1', title: 'IND Approval', date: '2025-06-12', status: 'Completed' },
      { id: 'm2', title: 'Phase I First Patient In', date: '2025-09-20', status: 'Completed' },
      { id: 'm3', title: 'Phase I Interim Data Release', date: '2026-04-15', status: 'In Progress' },
      { id: 'm4', title: 'Phase II Initiation', date: '2027-01-10', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f1', name: 'BP-101_Phase_I_Interim_Report.pdf', type: 'pdf', size: '4.2 MB', category: 'Clinical', lastUpdated: '2026-01-15' },
      { id: 'f2', name: 'BP-101_TME-Shield_Patent_Summary.pdf', type: 'pdf', size: '1.8 MB', category: 'IP', lastUpdated: '2025-11-20' },
      { id: 'f3', name: 'BP-101_CMC_Process_Validation.xlsx', type: 'xlsx', size: '2.5 MB', category: 'CMC', lastUpdated: '2025-12-05' }
    ],
    collaborationModels: ['Out-licensing', 'Strategic Partnership', 'Joint Development'],
    contact: {
      name: 'Dr. Sarah Chen',
      position: 'Chief Scientific Officer',
      linkedin: 'https://www.linkedin.com/in/sarah-chen-biotech'
    }
  },
  {
    id: '2',
    title: 'Small Molecule Inhibitor for Alzheimer\'s Disease',
    code: 'BP-202',
    description: 'A highly selective, brain-penetrant small molecule targeting beta-amyloid aggregation pathways to slow cognitive decline.',
    stage: 'Phase II',
    area: 'Neurology',
    mechanismOfAction: 'Inhibition of beta-secretase 1 (BACE1) to reduce amyloid-beta production and plaque formation.',
    keyData: [
      'Significant reduction in CSF amyloid-beta levels.',
      'Improved cognitive scores in Phase IIa study.',
      'Excellent blood-brain barrier penetration.'
    ],
    partneringStatus: 'Under Negotiation',
    projectStatus: 'Accelerated',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/neurology/800/600',
    technicalIntroduction: 'Highly selective BACE1 inhibitor with superior brain penetration and safety profile.',
    target: 'BACE1',
    indication: 'Alzheimer\'s Disease',
    modality: 'Small Molecule',
    ipStatus: 'Composition of matter patents granted globally; expires 2042.',
    competitiveLandscape: 'BP-202 enters a field previously dominated by failed BACE inhibitors. However, its 1000-fold selectivity over BACE2 and superior safety profile distinguish it from earlier candidates from Merck and Eli Lilly. It is currently one of the few oral small molecules in Phase II that addresses the underlying pathology without significant off-target toxicity.',
    background: 'Alzheimer\'s disease remains one of the most significant global health burdens. While recent antibody therapies have shown promise, an orally bioavailable small molecule that can cross the blood-brain barrier effectively remains a "holy grail" for patient convenience and systemic management.',
    coreTechnology: 'BP-202 is a non-peptidic, highly selective BACE1 inhibitor developed through structure-based drug design. It exhibits 1000-fold selectivity over BACE2, minimizing potential side effects related to skin pigmentation and retinal function.',
    researchProgress: 'Completed Phase IIa proof-of-concept study. Data showed a dose-dependent reduction in amyloid-beta 42 levels in cerebrospinal fluid. Phase IIb planning is underway to evaluate long-term cognitive outcomes.',
    potentialApplications: [
      'Early-stage Alzheimer\'s Disease',
      'Mild Cognitive Impairment (MCI)',
      'Down Syndrome-related Dementia'
    ],
    milestones: [
      { id: 'm5', title: 'Phase IIa Completion', date: '2026-02-10', status: 'Completed' },
      { id: 'm6', title: 'Phase IIb Protocol Submission', date: '2026-05-20', status: 'In Progress' },
      { id: 'm7', title: 'Phase II b Initiation', date: '2026-09-15', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f4', name: 'BP-202_Phase_IIa_Clinical_Study_Report.pdf', type: 'pdf', size: '8.5 MB', category: 'Clinical', lastUpdated: '2026-02-10' },
      { id: 'f5', name: 'BP-202_BACE1_Selectivity_Profile.pdf', type: 'pdf', size: '1.2 MB', category: 'Regulatory', lastUpdated: '2025-10-15' },
      { id: 'f6', name: 'BP-202_Market_Opportunity_Analysis.pptx', type: 'pptx', size: '12.4 MB', category: 'Commercial', lastUpdated: '2026-01-20' }
    ],
    collaborationModels: ['Regional Rights', 'Strategic Partnership', 'Equity Investment'],
    contact: {
      name: 'Michael Ross',
      position: 'Head of Business Development',
      linkedin: 'https://www.linkedin.com/in/michael-ross-bd'
    }
  },
  {
    id: '3',
    title: 'Gene Therapy for Rare Genetic Disorders',
    code: 'BP-303',
    description: 'An AAV-based gene therapy designed to deliver a functional copy of the GBA1 gene for the treatment of Gaucher disease.',
    stage: 'Pre-clinical',
    area: 'Rare Diseases',
    mechanismOfAction: 'Adeno-associated virus (AAV) vector delivery of the glucocerebrosidase gene to target tissues.',
    keyData: [
      'Restoration of enzyme activity in patient-derived cell lines.',
      'Successful delivery to liver and bone marrow in non-human primates.',
      'No significant off-target effects observed.'
    ],
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/genetherapy/800/600',
    technicalIntroduction: 'AAV-based gene therapy delivering functional GBA1 gene with CNS-optimized capsid.',
    target: 'GBA1',
    indication: 'Gaucher Disease',
    modality: 'Gene Therapy (AAV)',
    ipStatus: 'Exclusive license for capsid technology; proprietary promoter patents pending.',
    competitiveLandscape: 'Current treatments for Gaucher disease are limited to ERT (Sanofi/Takeda) and SRT. BP-303 is one of the first gene therapies to target the GBA1 gene with a CNS-penetrant capsid, positioning it as a potential curative option for Type 2/3 Gaucher patients who currently have no effective treatment for neurological symptoms.',
    background: 'Gaucher disease is caused by mutations in the GBA1 gene, leading to lysosomal storage issues. Current enzyme replacement therapies (ERT) require lifelong bi-weekly infusions and do not effectively address neurological symptoms in certain types of the disease.',
    coreTechnology: 'Utilizes a next-generation AAV9-variant capsid with enhanced tropism for both the central nervous system and systemic organs. The expression is controlled by a tissue-specific promoter to ensure safety and efficacy.',
    researchProgress: 'Pre-clinical toxicology and efficacy studies in GBA1-deficient mouse models are complete. Non-human primate studies have confirmed robust biodistribution. IND filing is targeted for Q1 2027.',
    potentialApplications: [
      'Gaucher Disease Type 1 and 3',
      'GBA-associated Parkinson\'s Disease',
      'Other Lysosomal Storage Disorders'
    ],
    milestones: [
      { id: 'm8', title: 'NHP Study Completion', date: '2025-11-30', status: 'Completed' },
      { id: 'm9', title: 'IND-Enabling Studies Start', date: '2026-03-01', status: 'In Progress' },
      { id: 'm10', title: 'IND Filing', date: '2027-01-15', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f7', name: 'BP-303_AAV9_Biodistribution_Data.pdf', type: 'pdf', size: '5.6 MB', category: 'Clinical', lastUpdated: '2026-01-05' },
      { id: 'f8', name: 'BP-303_Preclinical_Efficacy_Summary.docx', type: 'docx', size: '2.1 MB', category: 'Clinical', lastUpdated: '2025-12-15' }
    ],
    collaborationModels: ['Global Rights', 'Joint Development', 'Strategic Partnership'],
    contact: {
      name: 'Dr. Elena Vance',
      position: 'Director of Rare Disease Research',
      linkedin: 'https://www.linkedin.com/in/elena-vance-rare'
    }
  },
  {
    id: '4',
    title: 'Novel Antiviral for Respiratory Syncytial Virus (RSV)',
    code: 'BP-404',
    description: 'A potent, orally bioavailable antiviral agent targeting the fusion protein of RSV to prevent viral entry and replication.',
    stage: 'Phase III',
    area: 'Infectious Diseases',
    mechanismOfAction: 'Binding to the RSV F protein, preventing the conformational change required for membrane fusion.',
    keyData: [
      '95% reduction in viral load in Phase II trials.',
      'Significant reduction in hospitalization duration.',
      'Well-tolerated in pediatric and elderly populations.'
    ],
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/antiviral/800/600',
    technicalIntroduction: 'Fusion inhibitor targeting RSV F protein with high potency and oral bioavailability.',
    target: 'RSV F Protein',
    indication: 'RSV Infection',
    modality: 'Small Molecule',
    ipStatus: 'Granted patents in major markets; orphan drug designation.',
    competitiveLandscape: 'With the recent approval of RSV vaccines (GSK/Pfizer), the focus is shifting to treatment. BP-404 is positioned as the leading oral therapeutic for active infection. Unlike Sanofi\'s Beyfortus (a prophylactic mAb), BP-404 is a small molecule designed for rapid viral clearance in symptomatic patients.',
    background: 'RSV is a leading cause of lower respiratory tract infections in infants and the elderly. Despite the recent approval of vaccines, there is still a critical need for effective therapeutic interventions for patients who are already infected.',
    coreTechnology: 'BP-404 is a first-in-class fusion inhibitor with a high barrier to resistance. Its unique binding pocket on the F protein is highly conserved across both RSV A and B strains.',
    researchProgress: 'Currently enrolling patients for a global Phase III pivotal trial. Interim analysis from Phase IIb showed a dramatic reduction in clinical symptom scores and viral shedding within 48 hours of treatment initiation.',
    potentialApplications: [
      'Pediatric RSV Infection',
      'Elderly and Immunocompromised Patients',
      'Prophylaxis in High-risk Settings'
    ],
    milestones: [
      { id: 'm11', title: 'Phase IIb Completion', date: '2025-12-20', status: 'Completed' },
      { id: 'm12', title: 'Phase III Initiation', date: '2026-02-15', status: 'Completed' },
      { id: 'm13', title: 'Phase III Interim Analysis', date: '2026-08-10', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f9', name: 'BP-404_Phase_IIb_Efficacy_Analysis.pdf', type: 'pdf', size: '10.2 MB', category: 'Clinical', lastUpdated: '2026-02-28' },
      { id: 'f10', name: 'BP-404_Phase_III_Protocol_Summary.pdf', type: 'pdf', size: '3.4 MB', category: 'Regulatory', lastUpdated: '2026-01-10' }
    ],
    collaborationModels: ['Out-licensing', 'Regional Rights', 'Commercial Partnership'],
    contact: {
      name: 'Robert Miller',
      position: 'VP of Clinical Operations',
      linkedin: 'https://www.linkedin.com/in/robert-miller-clinops'
    }
  },
  {
    id: '5',
    title: 'Monoclonal Antibody for Severe Asthma',
    code: 'BP-505',
    description: 'A humanized monoclonal antibody targeting IL-5 to reduce eosinophilic inflammation in patients with severe, uncontrolled asthma.',
    stage: 'Approved',
    area: 'Immunology',
    mechanismOfAction: 'Neutralization of IL-5, a key cytokine involved in eosinophil recruitment and activation.',
    keyData: [
      '50% reduction in annual exacerbation rate.',
      'Significant improvement in lung function (FEV1).',
      'Reduction in oral corticosteroid use.'
    ],
    partneringStatus: 'Closed',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/asthma/800/600',
    technicalIntroduction: 'Humanized mAb targeting IL-5 with extended half-life for severe asthma.',
    target: 'IL-5',
    indication: 'Severe Eosinophilic Asthma',
    modality: 'Monoclonal Antibody',
    ipStatus: 'Granted patents; formulation patents pending for extended life.',
    competitiveLandscape: 'BP-505 competes in the severe asthma space against Nucala (GSK) and Fasenra (AstraZeneca). Its primary competitive advantage is the extended 8-week dosing interval and superior reduction in oral corticosteroid dependence, making it a preferred choice for long-term management.',
    background: 'Severe eosinophilic asthma is characterized by frequent exacerbations and poor quality of life. Many patients remain symptomatic despite high-dose inhaled corticosteroids and long-acting beta-agonists.',
    coreTechnology: 'A high-affinity IgG1 monoclonal antibody engineered for an extended half-life, allowing for once-every-8-weeks subcutaneous dosing. The antibody specifically binds to the IL-5 ligand with picomolar affinity.',
    researchProgress: 'FDA and EMA approved. Currently in post-marketing surveillance and Phase IV studies to evaluate long-term safety and efficacy in broader pediatric populations.',
    potentialApplications: [
      'Severe Eosinophilic Asthma',
      'Eosinophilic Granulomatosis with Polyangiitis (EGPA)',
      'Hypereosinophilic Syndrome (HES)'
    ],
    milestones: [
      { id: 'm14', title: 'FDA Approval', date: '2025-08-15', status: 'Completed' },
      { id: 'm15', title: 'Commercial Launch', date: '2025-11-01', status: 'Completed' },
      { id: 'm16', title: 'Phase IV Initiation', date: '2026-03-15', status: 'In Progress' }
    ],
    dataRoomFiles: [
      { id: 'f11', name: 'BP-505_FDA_Approval_Package.pdf', type: 'pdf', size: '25.4 MB', category: 'Regulatory', lastUpdated: '2025-09-12' },
      { id: 'f12', name: 'BP-505_Post-Marketing_Surveillance_Q4.pdf', type: 'pdf', size: '4.8 MB', category: 'Clinical', lastUpdated: '2026-01-05' }
    ],
    collaborationModels: ['Commercial Partnership', 'Distribution Rights'],
    contact: {
      name: 'Linda Gao',
      position: 'Global Alliance Manager',
      linkedin: 'https://www.linkedin.com/in/linda-gao-alliance'
    }
  },
  {
    id: '6',
    title: 'siRNA Therapy for Refractory Hypercholesterolemia',
    code: 'BP-606',
    description: 'A long-acting siRNA targeting PCSK9 mRNA to provide sustained reduction of LDL-C with bi-annual dosing.',
    stage: 'Phase II',
    area: 'Cardiovascular',
    mechanismOfAction: 'RNA interference-mediated silencing of the PCSK9 gene in hepatocytes, leading to increased LDL receptor recycling.',
    keyData: [
      '65% sustained reduction in LDL-C at 6 months.',
      'Excellent safety profile with no liver enzyme elevations.',
      'Consistent efficacy across diverse patient populations.'
    ],
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/cardio/800/600',
    technicalIntroduction: 'GalNAc-conjugated siRNA for liver-specific delivery and potent PCSK9 knockdown.',
    target: 'PCSK9',
    indication: 'Hypercholesterolemia',
    modality: 'siRNA',
    ipStatus: 'Broad composition and delivery patents; FTO confirmed.',
    competitiveLandscape: 'While Leqvio (Novartis) is on the market, BP-606 utilizes a proprietary chemical modification pattern that enhances potency and potentially extends the dosing interval to once-yearly, offering a significant convenience advantage.',
    background: 'High LDL cholesterol is a primary driver of cardiovascular disease. Despite statins and monoclonal antibodies, many patients fail to reach target levels or suffer from poor compliance with frequent injections.',
    coreTechnology: 'Our "Lipo-Silence" platform optimizes siRNA stability and hepatocyte uptake using a unique GalNAc cluster and enhanced phosphorothioate backbone modifications.',
    researchProgress: 'Phase IIa data demonstrated robust and durable LDL-C lowering. Phase IIb dose-finding study is currently 50% enrolled.',
    potentialApplications: [
      'Primary Hypercholesterolemia',
      'Homozygous Familial Hypercholesterolemia',
      'Statin-Intolerant Patients'
    ],
    milestones: [
      { id: 'm17', title: 'Phase IIa Data Readout', date: '2025-11-15', status: 'Completed' },
      { id: 'm18', title: 'Phase IIb Initiation', date: '2026-01-20', status: 'Completed' },
      { id: 'm19', title: 'Phase IIb Top-line Results', date: '2026-12-05', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f13', name: 'BP-606_Phase_IIa_Summary.pdf', type: 'pdf', size: '3.1 MB', category: 'Clinical', lastUpdated: '2025-12-01' },
      { id: 'f14', name: 'BP-606_Stability_Data_Package.xlsx', type: 'xlsx', size: '1.4 MB', category: 'CMC', lastUpdated: '2026-02-10' }
    ],
    collaborationModels: ['Global Rights', 'Joint Development'],
    contact: {
      name: 'Dr. Marcus Thorne',
      position: 'Head of Cardiovascular Research',
      linkedin: 'https://www.linkedin.com/in/marcus-thorne-cv'
    }
  },
  {
    id: '7',
    title: 'mRNA Replacement Therapy for Propionic Acidemia',
    code: 'BP-707',
    description: 'LNP-encapsulated mRNA encoding the PCCA/PCCB subunits to restore mitochondrial enzyme function in rare metabolic disorders.',
    stage: 'Pre-clinical',
    area: 'Rare Diseases',
    mechanismOfAction: 'Delivery of mRNA to hepatocytes to produce functional propionyl-CoA carboxylase enzyme.',
    keyData: [
      'Normalization of biomarkers in PA mouse models.',
      'Dose-dependent protein expression in NHP studies.',
      'Proprietary LNP with reduced immunogenicity.'
    ],
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/metabolic/800/600',
    technicalIntroduction: 'Codon-optimized mRNA delivered via biodegradable ionizable LNPs for metabolic restoration.',
    target: 'PCCA/PCCB',
    indication: 'Propionic Acidemia',
    modality: 'mRNA',
    ipStatus: 'Patents pending for mRNA sequence and LNP composition.',
    competitiveLandscape: 'Propionic Acidemia has no approved disease-modifying therapies. BP-707 represents a first-in-class mRNA approach that directly addresses the genetic deficiency, potentially offering a safer and more scalable alternative to liver transplantation.',
    background: 'Propionic Acidemia is a life-threatening metabolic disorder caused by enzyme deficiencies, leading to toxic metabolite buildup and frequent metabolic crises.',
    coreTechnology: 'Our "Eco-LNP" system is designed for high hepatic efficiency with rapid clearance, minimizing the risk of accumulation during chronic redosing.',
    researchProgress: 'Final IND-enabling toxicology studies are underway. We have established a robust manufacturing process at the 20L scale.',
    potentialApplications: [
      'Propionic Acidemia',
      'Methylmalonic Acidemia (Expansion)',
      'Other Organic Acidemias'
    ],
    milestones: [
      { id: 'm20', title: 'NHP Proof of Concept', date: '2025-10-10', status: 'Completed' },
      { id: 'm21', title: 'IND Filing', date: '2026-06-30', status: 'Upcoming' },
      { id: 'm22', title: 'Phase I Initiation', date: '2026-11-15', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f15', name: 'BP-707_Preclinical_Efficacy_NHP.pdf', type: 'pdf', size: '6.7 MB', category: 'Clinical', lastUpdated: '2026-01-20' },
      { id: 'f16', name: 'BP-707_LNP_Safety_Profile.pdf', type: 'pdf', size: '2.2 MB', category: 'Regulatory', lastUpdated: '2025-11-15' }
    ],
    collaborationModels: ['Strategic Partnership', 'Equity Investment'],
    contact: {
      name: 'Sarah Jenkins',
      position: 'Director of Rare Disease BD',
      linkedin: 'https://www.linkedin.com/in/sarah-jenkins-bd'
    }
  },
  {
    id: '8',
    title: 'Bispecific T-cell Engager for Multiple Myeloma',
    code: 'BP-808',
    description: 'A next-generation bispecific antibody targeting BCMA and CD3, optimized for high potency and low cytokine release syndrome.',
    stage: 'Phase I',
    area: 'Oncology',
    mechanismOfAction: 'Simultaneous binding to BCMA on myeloma cells and CD3 on T-cells, triggering T-cell mediated cytotoxicity.',
    keyData: [
      '75% ORR in relapsed/refractory patients (Cohort 3).',
      'Low incidence of Grade 3+ CRS compared to benchmarks.',
      'Convenient subcutaneous administration.'
    ],
    partneringStatus: 'Under Negotiation',
    projectStatus: 'Accelerated',
    reviewStatus: 'Approved',
    imageUrl: 'https://picsum.photos/seed/myeloma/800/600',
    technicalIntroduction: 'High-affinity BCMA/CD3 bispecific antibody with Fc-engineering for extended half-life.',
    target: 'BCMA / CD3',
    indication: 'Relapsed/Refractory Multiple Myeloma',
    modality: 'Bispecific Antibody',
    ipStatus: 'Composition of matter patents granted in US and EU; expires 2043.',
    competitiveLandscape: 'While Tecvayli (J&J) is approved, BP-808 features a unique CD3-binding arm with lower affinity, which has been shown in early trials to significantly reduce the severity of CRS while maintaining high anti-tumor activity.',
    background: 'Multiple Myeloma remains incurable for most patients. Despite the success of CAR-T, "off-the-shelf" bispecific antibodies offer immediate access and broader utility in the community setting.',
    coreTechnology: 'Our "Safe-Engage" platform utilizes a proprietary CD3 binder that selectively activates T-cells in the presence of high-density tumor antigens, minimizing systemic cytokine spikes.',
    researchProgress: 'Phase I dose escalation is nearing completion. We have identified the Recommended Phase II Dose (RP2D) and are preparing for expansion cohorts.',
    potentialApplications: [
      'R/R Multiple Myeloma',
      'First-line Myeloma (Combination)',
      'Other BCMA-positive B-cell Malignancies'
    ],
    milestones: [
      { id: 'm23', title: 'Phase I Dose Escalation Complete', date: '2026-03-01', status: 'Completed' },
      { id: 'm24', title: 'RP2D Selection', date: '2026-03-15', status: 'Completed' },
      { id: 'm25', title: 'Phase II Expansion Start', date: '2026-07-01', status: 'Upcoming' }
    ],
    dataRoomFiles: [
      { id: 'f17', name: 'BP-808_Phase_I_Safety_Update.pdf', type: 'pdf', size: '5.4 MB', category: 'Clinical', lastUpdated: '2026-03-10' },
      { id: 'f18', name: 'BP-808_Manufacturing_Scale-up.pptx', type: 'pptx', size: '8.9 MB', category: 'CMC', lastUpdated: '2026-01-15' }
    ],
    collaborationModels: ['Joint Development', 'Regional Rights'],
    contact: {
      name: 'Dr. Alan Wu',
      position: 'VP of Oncology Strategy',
      linkedin: 'https://www.linkedin.com/in/alan-wu-oncology'
    }
  }
];
