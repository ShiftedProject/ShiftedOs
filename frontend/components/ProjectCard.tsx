
import React from 'react';
import { Project, ProjectStatus } from '../types';
import Tag from './Tag';
import CalendarIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';
import Button from './Button';

interface ProjectCardProps {
  project: Project;
  onViewTasks: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewTasks, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColorClass = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'bg-green-500 text-white';
      case ProjectStatus.PLANNING: return 'bg-blue-500 text-white';
      case ProjectStatus.COMPLETED: return 'bg-purple-600 text-white';
      case ProjectStatus.ON_HOLD: return 'bg-yellow-400 text-yellow-800';
      case ProjectStatus.CANCELLED: return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth hover:shadow-strong transition-shadow duration-200 border border-gray-300/50 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-md sm:text-lg font-semibold text-text-primary mr-2 flex-1 break-words" title={project.name}>{project.name}</h3>
          <Tag text={project.status} customColorClass={getStatusColorClass(project.status)} size="md" />
        </div>
        
        <p className="text-sm text-text-secondary mb-3 h-12 overflow-y-auto line-clamp-2">{project.description || "No description provided."}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm mb-4">
          <div className="flex items-center text-text-secondary">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            Start: <span className="font-medium text-text-primary ml-1 truncate">{formatDate(project.startDate)}</span>
          </div>
          <div className="flex items-center text-text-secondary">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            End: <span className="font-medium text-text-primary ml-1 truncate">{formatDate(project.endDate)}</span>
          </div>
          {project.owner && (
            <div className="flex items-center text-text-secondary sm:col-span-2">
              <UserIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
              Owner: <span className="font-medium text-text-primary ml-1 truncate">{project.owner}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <Button onClick={() => onViewTasks(project.id)} size="sm" variant="primary">View Tasks</Button>
        <Button onClick={() => onEdit(project)} size="sm" variant="ghost">Edit Project</Button>
        <Button onClick={() => onDelete(project.id)} size="sm" variant="danger" className="ml-auto bg-transparent text-red-500 hover:bg-red-500/10">Delete</Button>
      </div>
    </div>
  );
};

export default ProjectCard;