/**
 * ProjectProgressChart Component
 * 
 * This component displays various charts to visualize project progress, including:
 * - Doughnut chart for milestone completion percentage
 * - Bar chart for milestone status
 * - Line chart for project timeline progress
 * 
 * It uses Chart.js and react-chartjs-2 to render interactive and responsive charts.
 *
 * @param project - BioProject object containing project data and milestones
 */
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { BioProject } from '../types';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  BarElement
);

interface ProjectProgressChartProps {
  project: BioProject;
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ project }) => {
  // Calculate milestone completion percentage
  const completedMilestones = project.milestones?.filter(m => m.status === 'Completed').length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const completionPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Doughnut chart data for milestone completion
  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [
          project.milestones?.filter(m => m.status === 'Completed').length || 0,
          project.milestones?.filter(m => m.status === 'In Progress').length || 0,
          project.milestones?.filter(m => m.status === 'Pending').length || 0
        ],
        backgroundColor: [
          '#10B981', // Emerald
          '#3B82F6', // Blue
          '#94A3B8', // Slate
        ],
        borderWidth: 0,
      },
    ],
  };

  // Bar chart data for project timeline
  const barData = {
    labels: project.milestones?.map(m => m.title) || [],
    datasets: [
      {
        label: 'Milestone Status',
        data: project.milestones?.map(m => {
          switch (m.status) {
            case 'Completed': return 100;
            case 'In Progress': return 50;
            default: return 0;
          }
        }) || [],
        backgroundColor: project.milestones?.map(m => {
          switch (m.status) {
            case 'Completed': return '#10B981';
            case 'In Progress': return '#3B82F6';
            default: return '#94A3B8';
          }
        }) || [],
        borderRadius: 8,
      },
    ],
  };

  // Line chart data for project progress over time
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: [10, 30, 45, 60, 75, completionPercentage],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-600 rounded-full" />
          Project Progress Overview
        </h4>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Completion Percentage */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <Doughnut
                data={doughnutData}
                options={{
                  ...chartOptions,
                  cutout: '70%',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{Math.round(completionPercentage)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</span>
              </div>
            </div>
          </div>
          
          {/* Milestone Status */}
          <div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                  <span className="text-sm font-bold text-slate-700">Completed</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {project.milestones?.filter(m => m.status === 'Completed').length || 0}/{totalMilestones}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-sm font-bold text-slate-700">In Progress</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {project.milestones?.filter(m => m.status === 'In Progress').length || 0}/{totalMilestones}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full" />
                  <span className="text-sm font-bold text-slate-700">Pending</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {project.milestones?.filter(m => m.status === 'Pending').length || 0}/{totalMilestones}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-600 rounded-full" />
          Milestone Progress
        </h4>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-600 rounded-full" />
          Project Timeline
        </h4>
        <div className="h-64">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressChart;