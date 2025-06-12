
import React from 'react';
import { Project, Task, TaskStatus, ProjectStatus, TaskPriority } from '../types'; // Added TaskPriority
import Button from './Button';
import Tag from './Tag';
import CalendarIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';

interface ProjectDetailViewProps {
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
}

const getPriorityDotColor = (priority?: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.URGENT: return 'bg-red-500';
    case TaskPriority.HIGH: return 'bg-orange-500';
    case TaskPriority.MEDIUM: return 'bg-yellow-400';
    case TaskPriority.LOW: return 'bg-sky-500';
    default: return 'bg-gray-400'; // For undefined or Medium as default
  }
};

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, tasks, onBackToProjects }) => {
  
  const projectStartDate = project.startDate ? new Date(project.startDate) : new Date();
  const projectEndDate = project.endDate ? new Date(project.endDate) : new Date(projectStartDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days if no end date

  let overallMinDate = new Date(projectStartDate);
  let overallMaxDate = new Date(projectEndDate);

  tasks.forEach(task => {
    if (task.startDate) {
      const taskStart = new Date(task.startDate);
      if (taskStart < overallMinDate) overallMinDate = taskStart;
    }
    if (task.deadline) {
      const taskEnd = new Date(task.deadline);
      if (taskEnd > overallMaxDate) overallMaxDate = taskEnd;
    } else if (task.startDate && task.duration) {
      const taskEnd = new Date(new Date(task.startDate).getTime() + task.duration * 24 * 60 * 60 * 1000);
      if (taskEnd > overallMaxDate) overallMaxDate = taskEnd;
    }
  });
  
  const timelineStartDate = new Date(overallMinDate);
  timelineStartDate.setDate(timelineStartDate.getDate() - 3); 
  const timelineEndDate = new Date(overallMaxDate);
  timelineEndDate.setDate(timelineEndDate.getDate() + 3);


  const getTotalDaysInTimeline = () => {
    return Math.max(1, Math.ceil((timelineEndDate.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  };
  const totalDays = getTotalDaysInTimeline();
  const dayWidth = 35; 

  const getDayOffset = (dateStr: string): number => {
    const date = new Date(dateStr);
    return Math.max(0, Math.floor((date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const getTaskDurationInDays = (task: Task): number => {
    if (task.duration) return task.duration;
    if (task.startDate && task.deadline) {
      const start = new Date(task.startDate);
      const end = new Date(task.deadline);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +1);
    }
    return 2; // Default 2 days if no duration/deadline
  };
  
  const getProjectDurationInDays = (proj: Project): number => {
     if (proj.startDate && proj.endDate) {
      const start = new Date(proj.startDate);
      const end = new Date(proj.endDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +1);
    }
    return Math.max(1, Math.ceil((overallMaxDate.getTime() - overallMinDate.getTime()) / (1000 * 60 * 60 * 24)) +1); 
  };


  const taskStatusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'bg-gray-400 text-gray-800 border-gray-500', 
    [TaskStatus.IN_PROGRESS]: 'bg-blue-500 text-white border-blue-600',
    [TaskStatus.IN_REVIEW]: 'bg-yellow-400 text-yellow-800 border-yellow-500',
    [TaskStatus.BLOCKED]: 'bg-red-500 text-white border-red-600',
    [TaskStatus.DONE]: 'bg-green-500 text-white border-green-600',
    [TaskStatus.PUBLISHED]: 'bg-purple-600 text-white border-purple-700',
  };

  const projectStatusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: 'bg-blue-600 text-white border-blue-700',
    [ProjectStatus.ACTIVE]: 'bg-green-600 text-white border-green-700',
    [ProjectStatus.COMPLETED]: 'bg-purple-700 text-white border-purple-800',
    [ProjectStatus.ON_HOLD]: 'bg-yellow-500 text-yellow-800 border-yellow-600',
    [ProjectStatus.CANCELLED]: 'bg-red-600 text-white border-red-700',
  };

  const monthMarkers: { name: string; offsetDays: number; spanDays: number }[] = [];
  let currentDate = new Date(timelineStartDate);
  while (currentDate <= timelineEndDate) {
    if (currentDate.getDate() === 1 || currentDate.getTime() === timelineStartDate.getTime()) {
      const monthName = currentDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const offset = getDayOffset(currentDate.toISOString());
      
      let spanDaysInCurrentTimeline = 0;
      if (currentDate.getFullYear() === timelineEndDate.getFullYear() && currentDate.getMonth() === timelineEndDate.getMonth()){
        spanDaysInCurrentTimeline = timelineEndDate.getDate() - currentDate.getDate() + 1;
      } else {
        spanDaysInCurrentTimeline = daysInMonth - currentDate.getDate() + 1;
      }
      
      const remainingTimelineDays = totalDays - offset;
      const span = Math.min(spanDaysInCurrentTimeline, remainingTimelineDays);

      if (span > 0) {
         monthMarkers.push({ name: monthName, offsetDays: offset, spanDays: span });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={onBackToProjects} className="mb-2 sm:mb-0">
            &larr; Back to Projects
          </Button>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mt-1">
            {project.name} - Gantt Chart
          </h2>
          <p className="text-sm text-text-secondary">{project.description}</p>
          {project.proofOfWorkUrl && (
            <a 
              href={project.proofOfWorkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-main-accent hover:text-highlight underline mt-1 inline-block"
            >
              View Proof of Work
            </a>
          )}
        </div>
      </div>

      <div className="bg-glass-bg backdrop-blur-xl rounded-xl shadow-strong p-4 sm:p-6 overflow-hidden border border-white/20">
        <div className="overflow-x-auto relative pb-4">
          <div style={{ width: `${totalDays * dayWidth}px`, minWidth: '100%' }}>
            {/* Timeline Header - Months */}
            <div className="flex h-8 sticky top-0 bg-glass-bg z-20">
              {monthMarkers.map((marker, index) => (
                <div 
                  key={`month-${index}`} 
                  className="text-xs font-semibold text-text-secondary text-center border-r border-b border-white/20 flex items-center justify-center" // More distinct border
                  style={{ width: `${marker.spanDays * dayWidth}px` }}
                >
                  {marker.name}
                </div>
              ))}
            </div>
            {/* Timeline Header - Days */}
            <div className="flex h-6 sticky top-8 bg-glass-bg z-20">
              {Array.from({ length: totalDays }).map((_, dayIndex) => (
                <div 
                  key={`day-header-${dayIndex}`}
                  className={`text-[0.6rem] text-text-secondary/80 text-center border-r border-b border-white/10 flex items-center justify-center
                              ${(new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDay() === 0 || new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDay() === 6) ? 'bg-main-background/20' : ''}
                           `}
                  style={{ width: `${dayWidth}px` }}
                >
                  {new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDate()}
                </div>
              ))}
            </div>

            {/* Project Row */}
            <div className="h-12 flex items-center my-1.5 relative border-b border-white/10">
              <div 
                className={`absolute h-9 rounded-md text-sm font-semibold flex items-center px-2.5 overflow-hidden shadow-lg transition-all hover:brightness-110 border-2 ${projectStatusColors[project.status]?.split(' ')[2] || 'border-gray-700'}`}
                style={{
                  left: `${getDayOffset(project.startDate || timelineStartDate.toISOString()) * dayWidth}px`,
                  width: `${getProjectDurationInDays(project) * dayWidth}px`,
                  backgroundColor: projectStatusColors[project.status]?.split(' ')[0] || 'bg-gray-500',
                  color: projectStatusColors[project.status]?.includes('text-white') ? 'white' : projectStatusColors[project.status]?.split('text-')[1] || 'text-gray-800'
                }}
                title={`${project.name}\nStatus: ${project.status}\nStart: ${formatDate(project.startDate)}\nEnd: ${formatDate(project.endDate)}`}
              >
                <span className="truncate">{project.name} (Project)</span>
              </div>
            </div>

            {/* Task Rows */}
            {tasks.map((task) => {
              const taskStartDay = task.startDate ? getDayOffset(task.startDate) : getDayOffset(project.startDate || timelineStartDate.toISOString());
              const taskDurationDays = getTaskDurationInDays(task);
              const statusColorInfo = taskStatusColors[task.status] || 'bg-gray-300 text-gray-800 border-gray-400';
              const [bgColor, textColor, borderColor] = statusColorInfo.split(' ');
              
              return (
                <div key={task.id} className="h-10 flex items-center my-1 relative group">
                  <div 
                    className={`absolute h-7 rounded-sm text-xs sm:text-sm font-medium flex items-center px-1.5 sm:px-2 overflow-hidden shadow-md transition-all hover:brightness-110 border ${borderColor}`}
                    style={{
                      left: `${taskStartDay * dayWidth}px`,
                      width: `${taskDurationDays * dayWidth}px`,
                      backgroundColor: bgColor,
                      color: textColor.includes('text-white') ? 'white' : textColor.split('text-')[1] || 'gray-800',
                    }}
                     title={`Task: ${task.title}\nStatus: ${task.status}\nPriority: ${task.priority || 'N/A'}\nAssignee: ${task.assignee || 'Unassigned'}\nStart: ${formatDate(task.startDate)}\nEnd: ${formatDate(task.deadline)}\nDuration: ${taskDurationDays}d`}
                  >
                    {/* Priority Dot */}
                    {task.priority && (
                        <span className={`w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0 ${getPriorityDotColor(task.priority)}`}></span>
                    )}
                    <span className="truncate">{task.title}</span>
                  </div>
                </div>
              );
            })}
             {tasks.length === 0 && (
                <div className="text-center py-6 text-text-secondary">
                    No tasks in this project to display on Gantt chart.
                </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-text-secondary mt-4 text-center">Note: Gantt chart is for visual overview. Dates and durations are based on provided data or estimates.</p>
    
      {/* Task Details Section */}
      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4">Task Details</h3>
        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-glass-depth text-center border border-gray-200/50">
            <p className="text-text-secondary">This project has no tasks.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={`detail-${task.id}`} className="bg-white p-4 rounded-xl shadow-glass-depth border border-gray-200/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-md sm:text-lg font-semibold text-text-primary">{task.title}</h4>
                  <Tag text={task.status} status={task.status} color="status" size="sm" />
                </div>
                <p className="text-sm text-text-secondary mb-3">{task.description || "No description."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
                  <div className="flex items-center text-text-secondary">
                    <UserIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                    Assignee: <span className="font-medium text-text-primary ml-1">{task.assignee || 'Unassigned'}</span>
                  </div>
                   <div className="flex items-center text-text-secondary">
                    <span className={`w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${getPriorityDotColor(task.priority || TaskPriority.MEDIUM)}`}></span>
                    Priority: <span className="font-medium text-text-primary ml-1">{task.priority || 'Medium'}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                    Start: <span className="font-medium text-text-primary ml-1">{formatDate(task.startDate)}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                    Deadline: <span className="font-medium text-text-primary ml-1">{formatDate(task.deadline)}</span>
                  </div>
                   <div className="flex items-center text-text-secondary">
                     <Tag text={task.divisionTag} color="division" division={task.divisionTag} size="sm" className="mr-1.5"/>
                     <Tag text={task.contentPillarTag} color="pillar" pillar={task.contentPillarTag} size="sm"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailView;