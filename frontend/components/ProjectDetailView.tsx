
import React from 'react';
import { Project, Task, TaskStatus, ProjectStatus } from '../types';
import Button from './Button';
import Tag from './Tag';

interface ProjectDetailViewProps {
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
}

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
  
  // Add some buffer to the timeline
  const timelineStartDate = new Date(overallMinDate);
  timelineStartDate.setDate(timelineStartDate.getDate() - 7); // Buffer start
  const timelineEndDate = new Date(overallMaxDate);
  timelineEndDate.setDate(timelineEndDate.getDate() + 7); // Buffer end


  const getTotalDaysInTimeline = () => {
    return Math.max(1, Math.ceil((timelineEndDate.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  };
  const totalDays = getTotalDaysInTimeline();
  const dayWidth = 30; // pixels per day - Increased for better text spacing

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
    return 1; // Default 1 day
  };
  
  const getProjectDurationInDays = (proj: Project): number => {
     if (proj.startDate && proj.endDate) {
      const start = new Date(proj.startDate);
      const end = new Date(proj.endDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +1);
    }
    return Math.max(1, Math.ceil((overallMaxDate.getTime() - overallMinDate.getTime()) / (1000 * 60 * 60 * 24)) +1); // Fallback to overall range
  };


  const taskStatusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'bg-gray-400 text-gray-800', // Improved contrast
    [TaskStatus.IN_PROGRESS]: 'bg-blue-500 text-white',
    [TaskStatus.IN_REVIEW]: 'bg-yellow-400 text-yellow-800',
    [TaskStatus.BLOCKED]: 'bg-red-500 text-white',
    [TaskStatus.DONE]: 'bg-green-500 text-white',
    [TaskStatus.PUBLISHED]: 'bg-purple-600 text-white',
  };

  const projectStatusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: 'bg-blue-600 text-white',
    [ProjectStatus.ACTIVE]: 'bg-green-600 text-white',
    [ProjectStatus.COMPLETED]: 'bg-purple-700 text-white',
    [ProjectStatus.ON_HOLD]: 'bg-yellow-500 text-yellow-800', // Good contrast
    [ProjectStatus.CANCELLED]: 'bg-red-600 text-white',
  };

  // Generate month and week markers
  const monthMarkers: { name: string; offsetDays: number; spanDays: number }[] = [];
  const weekMarkers: { offsetDays: number }[] = [];
  let currentDate = new Date(timelineStartDate);
  while (currentDate <= timelineEndDate) {
    if (currentDate.getDate() === 1 || currentDate.getTime() === timelineStartDate.getTime()) {
      const monthName = currentDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const offset = getDayOffset(currentDate.toISOString());
      const span = (currentDate.getMonth() === timelineEndDate.getMonth() && currentDate.getFullYear() === timelineEndDate.getFullYear()) 
                   ? getDayOffset(timelineEndDate.toISOString()) - offset + 1
                   : daysInMonth - currentDate.getDate() + 1;
      monthMarkers.push({ name: monthName, offsetDays: offset, spanDays: Math.min(span, totalDays - offset) });
    }
    if (currentDate.getDay() === 1 || weekMarkers.length === 0 ) { // Monday or first week
        weekMarkers.push({ offsetDays: getDayOffset(currentDate.toISOString()) });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  

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
                  className="text-xs font-semibold text-text-secondary text-center border-r border-b border-white/10 flex items-center justify-center"
                  style={{ width: `${marker.spanDays * dayWidth}px`, marginLeft: index === 0 ? `0px` : `0px` }}
                >
                  {marker.name}
                </div>
              ))}
            </div>
            {/* Timeline Header - Weeks & Days (Grid) */}
            <div className="flex h-6 sticky top-8 bg-glass-bg z-20">
              {Array.from({ length: totalDays }).map((_, dayIndex) => (
                <div 
                  key={`day-header-${dayIndex}`}
                  className={`text-[0.6rem] text-text-secondary/70 text-center border-r border-b border-white/10 flex items-center justify-center
                              ${(new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDay() === 0 || new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDay() === 6) ? 'bg-main-background/20' : ''}
                           `}
                  style={{ width: `${dayWidth}px` }}
                >
                  {new Date(timelineStartDate.getTime() + dayIndex * 24*60*60*1000).getDate()}
                </div>
              ))}
            </div>

            {/* Project Row */}
            <div className="h-12 flex items-center my-1 relative border-b border-white/10"> {/* Increased height */}
              <div 
                className="absolute h-9 rounded text-sm font-medium flex items-center px-2 overflow-hidden shadow-md transition-all hover:opacity-90" /* Increased height and font size */
                style={{
                  left: `${getDayOffset(project.startDate || timelineStartDate.toISOString()) * dayWidth}px`,
                  width: `${getProjectDurationInDays(project) * dayWidth}px`,
                  backgroundColor: projectStatusColors[project.status] || 'bg-gray-500', // Direct style for bg
                  color: (project.status === ProjectStatus.ON_HOLD) ? 'text-yellow-800' : 'text-white' // Ensure text color based on status
                }}
                title={`${project.name}\nStatus: ${project.status}\nStart: ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}\nEnd: ${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}`}
              >
                <span className="truncate">{project.name} (Project)</span>
              </div>
            </div>

            {/* Task Rows */}
            {tasks.map((task) => {
              const taskStartDay = task.startDate ? getDayOffset(task.startDate) : getDayOffset(project.startDate || timelineStartDate.toISOString());
              const taskDurationDays = getTaskDurationInDays(task);
              const taskEndDate = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A';
              const taskStartDateFormatted = task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A';
              
              return (
                <div key={task.id} className="h-10 flex items-center my-1 relative group"> {/* Increased height */}
                   {/* Task Label on the left - not part of the scrollable timeline */}
                   {/* This part might need adjustment if task list is separate */}

                  <div 
                    className="absolute h-7 rounded text-xs sm:text-sm font-medium flex items-center px-1.5 sm:px-2 overflow-hidden shadow-sm transition-all hover:opacity-80" /* Increased height and font size */
                    style={{
                      left: `${taskStartDay * dayWidth}px`,
                      width: `${taskDurationDays * dayWidth}px`,
                      backgroundColor: taskStatusColors[task.status].split(' ')[0], // Get only bg color part
                      color: taskStatusColors[task.status].includes('text-white') ? 'white' : taskStatusColors[task.status].split('text-')[1], // Infer text color
                    }}
                    title={`Task: ${task.title}\nStatus: ${task.status}\nAssignee: ${task.assignee || 'Unassigned'}\nStart: ${taskStartDateFormatted}\nEnd: ${taskEndDate}\nDuration: ${taskDurationDays}d`}
                  >
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
    </div>
  );
};

export default ProjectDetailView;
