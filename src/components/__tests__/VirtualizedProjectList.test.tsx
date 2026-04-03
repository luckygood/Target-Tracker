import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VirtualizedProjectList from '../VirtualizedProjectList';
import { BioProject } from '../../types';

const mockProjects: BioProject[] = [
  {
    id: '1',
    title: 'Test Project 1',
    code: 'TP-001',
    description: 'Test project description 1',
    technicalIntroduction: 'Technical intro 1',
    competitiveLandscape: 'Competitive landscape 1',
    imageUrl: 'https://example.com/image1.jpg',
    stage: 'Pre-clinical',
    area: 'Oncology',
    modality: 'Small Molecule',
    target: 'Target 1',
    indication: 'Indication 1',
    ipStatus: 'Patented',
    partneringStatus: 'Open',
    projectStatus: 'On Track',
    keyData: ['Key data 1', 'Key data 2'],
    milestones: [
      {
        id: '1',
        title: 'Milestone 1',
        date: '2024-12-31',
        status: 'Completed'
      }
    ],
    dataRoomFiles: [
      {
        id: '1',
        name: 'File 1',
        url: 'https://example.com/file1.pdf',
        type: 'PDF',
        size: '1MB'
      }
    ]
  },
  {
    id: '2',
    title: 'Test Project 2',
    code: 'TP-002',
    description: 'Test project description 2',
    technicalIntroduction: 'Technical intro 2',
    competitiveLandscape: 'Competitive landscape 2',
    imageUrl: 'https://example.com/image2.jpg',
    stage: 'Phase I',
    area: 'Neurology',
    modality: 'Antibody',
    target: 'Target 2',
    indication: 'Indication 2',
    ipStatus: 'Pending',
    partneringStatus: 'Under Negotiation',
    projectStatus: 'On Track',
    keyData: ['Key data 1', 'Key data 2'],
    milestones: [
      {
        id: '1',
        title: 'Milestone 1',
        date: '2024-12-31',
        status: 'In Progress'
      }
    ],
    dataRoomFiles: [
      {
        id: '1',
        name: 'File 1',
        url: 'https://example.com/file1.pdf',
        type: 'PDF',
        size: '1MB'
      }
    ]
  }
];

describe('VirtualizedProjectList', () => {
  const mockOnProjectClick = jest.fn();
  const mockOnToggleSave = jest.fn();
  const mockOnToggleCompare = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders project list correctly', () => {
    render(
      <VirtualizedProjectList
        projects={mockProjects}
        onProjectClick={mockOnProjectClick}
        onToggleSave={mockOnToggleSave}
        onToggleCompare={mockOnToggleCompare}
        savedProjects={[]}
        compareList={[]}
        selectedArea='All'
        selectedStatus='All'
        searchTerm=''
        isFA={false}
      />
    );

    // Check if the component renders without errors
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  test('calls onProjectClick when project is clicked', () => {
    render(
      <VirtualizedProjectList
        projects={mockProjects}
        onProjectClick={mockOnProjectClick}
        onToggleSave={mockOnToggleSave}
        onToggleCompare={mockOnToggleCompare}
        savedProjects={[]}
        compareList={[]}
        selectedArea='All'
        selectedStatus='All'
        searchTerm=''
        isFA={false}
      />
    );

    // Click on the first project
    fireEvent.click(screen.getByText('Test Project 1'));
    expect(mockOnProjectClick).toHaveBeenCalledWith(mockProjects[0]);
  });

  test('filters projects by search term', () => {
    render(
      <VirtualizedProjectList
        projects={mockProjects}
        onProjectClick={mockOnProjectClick}
        onToggleSave={mockOnToggleSave}
        onToggleCompare={mockOnToggleCompare}
        savedProjects={[]}
        compareList={[]}
        selectedArea='All'
        selectedStatus='All'
        searchTerm='Test Project 1'
        isFA={false}
      />
    );

    // Check if only the matching project is rendered
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  test('filters projects by area', () => {
    render(
      <VirtualizedProjectList
        projects={mockProjects}
        onProjectClick={mockOnProjectClick}
        onToggleSave={mockOnToggleSave}
        onToggleCompare={mockOnToggleCompare}
        savedProjects={[]}
        compareList={[]}
        selectedArea='Oncology'
        selectedStatus='All'
        searchTerm=''
        isFA={false}
      />
    );

    // Check if only the matching project is rendered
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });
});