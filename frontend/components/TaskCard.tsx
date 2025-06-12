
import React from 'react';
import { Task, TaskStatus, Division, ContentPillar } from '../types';
import Tag from './Tag';
import CalendarIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';
import TagIcon from './icons/TagIcon';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onUpdateStatus }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth hover:shadow-strong transition-shadow duration-200 border border-gray-300/50 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-md sm:text-lg font-semibold text-text-primary mr-2 flex-1 break-words">{task.title}</h3>
          <Tag text={task.status} status={task.status} color="status" size="md" />
        </div>
        
        <p className="text-sm text-text-secondary mb-3 h-16 overflow-y-auto line-clamp-3">{task.description || "No description provided."}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm mb-4">
          <div className="flex items-center text-text-secondary">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            Deadline: <span className="font-medium text-text-primary ml-1 truncate">{formatDate(task.deadline)}</span>
          </div>
          <div className="flex items-center text-text-secondary">
            <UserIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            Assignee: <span className="font-medium text-text-primary ml-1 truncate">{task.assignee || 'Unassigned'}</span>
          </div>
          <div className="flex items-center text-text-secondary">
            <TagIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            Division: <Tag text={task.divisionTag} color="division" division={task.divisionTag} size="sm" className="ml-1" />
          </div>
          <div className="flex items-center text-text-secondary">
            <TagIcon className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
            Pillar: <Tag text={task.contentPillarTag} color="pillar" pillar={task.contentPillarTag} size="sm" className="ml-1" />
          </div>
        </div>
        
        {task.status === TaskStatus.PUBLISHED && (task.views !== undefined || task.likes !== undefined || task.engagementRate !== undefined) && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-text-secondary">
            <p>Views: {task.views ?? 'N/A'} | Likes: {task.likes ?? 'N/A'} | Engagement: {task.engagementRate ? `${task.engagementRate}%` : 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <Button onClick={() => onEdit(task)} size="sm" variant="ghost">Edit</Button>
        {task.status !== TaskStatus.IN_REVIEW && task.status !== TaskStatus.PUBLISHED && task.status !== TaskStatus.DONE && (
          <Button onClick={() => onUpdateStatus(task.id, TaskStatus.IN_REVIEW)} size="sm" variant="secondary">Request Review</Button>
        )}
        {task.status === TaskStatus.IN_REVIEW && (
          <>
            <Button onClick={() => onUpdateStatus(task.id, TaskStatus.PUBLISHED)} size="sm" variant="primary" customColorClass="bg-green-500 hover:bg-green-600 text-white">Approve & Publish</Button>
            <Button onClick={() => onUpdateStatus(task.id, TaskStatus.IN_PROGRESS)} size="sm" variant="danger">Request Changes</Button>
          </>
        )}
         <Button onClick={() => onDelete(task.id)} size="sm" variant="danger" className="ml-auto bg-transparent text-red-500 hover:bg-red-500/10">Delete</Button>
      </div>
    </div>
  );
};

export default TaskCard;