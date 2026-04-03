import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectProgressChart from '../ProjectProgressChart';
import { BioProject } from '../../types';

const mockProject: BioProject = {
  id: '1',
  title: 'Test Project',
  code: 'TP-001',
  description: 'Test project description',
  technicalIntroduction: 'Technical intro',
  competitiveLandscape: 'Competitive landscape',
  imageUrl: 'https://example.com/image.jpg',
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
    },
    {
      id: '2',
      title: 'Milestone 2',
      date: '2025-06-30',
      status: 'In Progress'
    },
    {
      id: '3',
      title: 'Milestone 3',
      date: '2025-12-31',
      status: 'Pending'
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
};

describe('ProjectProgressChart', () => {
  test('renders project progress chart correctly', () => {
    render(<ProjectProgressChart project={mockProject} />);

    // Check if the component renders without errors
    expect(screen.getByText('Project Progress Overview')).toBeInTheDocument();
    expect(screen.getByText('Milestone Progress')).toBeInTheDocument();
    expect(screen.getByText('Project Timeline')).toBeInTheDocument();
  });

  test('displays correct completion percentage', () => {
    render(<ProjectProgressChart project={mockProject} />);

    // Check if the completion percentage is displayed correctly
    // 1 completed milestone out of 3 total = 33%
    expect(screen.getByText('33%')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('displays milestone status correctly', () => {
    render(<ProjectProgressChart project={mockProject} />);

    // Check if milestone statuses are displayed correctly
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('handles project without milestones', () => {
    const projectWithoutMilestones = {
      ...mockProject,
      milestones: []
    };

    render(<ProjectProgressChart project={projectWithoutMilestones} />);

    // Check if the component renders without errors
    expect(screen.getByText('Project Progress Overview')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});