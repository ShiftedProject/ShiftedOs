
import React, { useState, useCallback } from 'react';
import Button from './Button';
import SelectInput from './SelectInput';
import { Project, Task, User, ReportCriteria, ReportTemplateType, GeneratedReportData, TaskStatus, UserRole, ContentPillar } from '../types';
import ReportIcon from './icons/ReportIcon';

// Mock expenses data for financial report, as FinanceView state is not directly accessible
const MOCK_EXPENSES = [
  { id: 'EXP-R01', projectId: 'PROJ-001', description: 'Marketing Ads Q3', amount: 5000000, date: '2024-07-25', category: 'Marketing' },
  { id: 'EXP-R02', projectId: 'PROJ-002', description: 'Freelance Video Editor', amount: 3500000, date: '2024-08-10', category: 'Services' },
  { id: 'EXP-R03', projectId: 'PROJ-001', description: 'Cloud Hosting - July', amount: 1200000, date: '2024-07-30', category: 'Software/Infra' },
  { id: 'EXP-R04', projectId: 'PROJ-003', description: 'Team Event Catering', amount: 2000000, date: '2024-06-20', category: 'Team Building' },
];


interface ReportViewProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
  currentUser: User | null;
}

const ReportView: React.FC<ReportViewProps> = ({ projects, tasks, users, currentUser }) => {
  const reportTemplates: { id: ReportTemplateType; name: string; allowedRoles: UserRole[] }[] = [
    { id: 'task_progress', name: 'Task Progress Report', allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER] },
    { id: 'financial_summary', name: 'Financial Summary', allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
    { id: 'team_productivity', name: 'Team Productivity Overview', allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
    { id: 'content_performance', name: 'Content Performance Report', allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER] },
  ];

  const [criteria, setCriteria] = useState<ReportCriteria>({
    template: '',
    startDate: new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString().split('T')[0], // Default to one month ago
    endDate: new Date().toISOString().split('T')[0], // Default to today
    projectId: 'all',
  });
  const [generatedReport, setGeneratedReport] = useState<GeneratedReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleCriteriaChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  }, []);

  const generateReport = useCallback(async () => {
    if (!currentUser) {
        setGenerationError("User not authenticated.");
        return;
    }
    if (!criteria.template) {
        setGenerationError("Please select a report template.");
        return;
    }
     const selectedTemplateConfig = reportTemplates.find(rt => rt.id === criteria.template);
    if (!selectedTemplateConfig || !selectedTemplateConfig.allowedRoles.includes(currentUser.role)) {
        setGenerationError("You do not have permission to generate this type of report.");
        return;
    }


    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedReport(null);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    let reportData: Partial<GeneratedReportData> = {
      title: reportTemplates.find(rt => rt.id === criteria.template)?.name || 'Generated Report',
      criteria,
      generatedAt: new Date().toISOString(),
    };

    const startDate = new Date(criteria.startDate);
    const endDate = new Date(criteria.endDate);
    endDate.setHours(23, 59, 59, 999); // Ensure end date includes the whole day

    switch (criteria.template) {
      case 'task_progress':
        const filteredTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt); // or task.updatedAt for progress
          const matchesDate = taskDate >= startDate && taskDate <= endDate;
          const matchesProject = criteria.projectId === 'all' || task.projectId === criteria.projectId;
          return matchesDate && matchesProject;
        });
        reportData.summary = {
          totalTasks: filteredTasks.length,
          todo: filteredTasks.filter(t => t.status === TaskStatus.TODO).length,
          inProgress: filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
          inReview: filteredTasks.filter(t => t.status === TaskStatus.IN_REVIEW).length,
          blocked: filteredTasks.filter(t => t.status === TaskStatus.BLOCKED).length,
          done: filteredTasks.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.PUBLISHED).length,
        };
        reportData.dataRows = filteredTasks.map(t => ({ ID: t.id, Title: t.title, Project: projects.find(p=>p.id === t.projectId)?.name || 'N/A', Assignee: t.assignee || 'Unassigned', Status: t.status, Deadline: t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A' }));
        break;
      
      case 'financial_summary':
        const financialExpenses = MOCK_EXPENSES.filter(exp => {
            const expDate = new Date(exp.date);
            const matchesDate = expDate >= startDate && expDate <= endDate;
            const matchesProject = criteria.projectId === 'all' || exp.projectId === criteria.projectId;
            return matchesDate && matchesProject;
        });
        reportData.summary = {
            totalExpenses: financialExpenses.reduce((sum, exp) => sum + exp.amount, 0),
            numberOfTransactions: financialExpenses.length,
        };
        reportData.dataRows = financialExpenses.map(exp => ({ Date: new Date(exp.date).toLocaleDateString(), Description: exp.description, Category: exp.category, Amount: `Rp ${exp.amount.toLocaleString('id-ID')}`}));
        break;
        
      // TODO: Implement other report types with mock data
      case 'team_productivity':
        reportData.message = "Team Productivity report generation is a complex feature and will be implemented with real data.";
        reportData.dataRows = users.map(user => ({ Name: user.name, Role: user.roleName || user.role, 'Tasks Completed (Mock)': Math.floor(Math.random() * 10)}));
        break;
      case 'content_performance':
        reportData.message = "Content Performance report is best with analytics integration. Showing mock data.";
        reportData.dataRows = tasks.filter(t => t.contentPillarTag !== ContentPillar.NONE && t.views !== undefined)
          .map(t => ({ Title: t.title, Pillar: t.contentPillarTag, Views: t.views, Likes: t.likes, Engagement: `${t.engagementRate}%`}));
        break;

      default:
        reportData.message = "Selected report template is not yet implemented.";
    }
    setGeneratedReport(reportData as GeneratedReportData);
    setIsGenerating(false);
  }, [criteria, tasks, projects, users, currentUser, reportTemplates]);

  const clearReport = () => {
    setGeneratedReport(null);
    setGenerationError(null);
  };
  
  const userVisibleReportTemplates = reportTemplates.filter(rt => currentUser && rt.allowedRoles.includes(currentUser.role));


  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Report Builder</h2>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Generate New Report</h3>
        
        <fieldset disabled={isGenerating} className="space-y-4">
          <SelectInput
            label="Report Template"
            name="template"
            value={criteria.template}
            onChange={handleCriteriaChange}
            options={userVisibleReportTemplates.map(rt => ({ value: rt.id, label: rt.name }))}
            placeholder="Select a template..."
            className="bg-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
              <input type="date" name="startDate" id="startDate" value={criteria.startDate} onChange={handleCriteriaChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
              <input type="date" name="endDate" id="endDate" value={criteria.endDate} onChange={handleCriteriaChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
            </div>
          </div>
           <SelectInput
            label="Filter by Project"
            name="projectId"
            value={criteria.projectId}
            onChange={handleCriteriaChange}
            options={[{value: 'all', label: 'All Projects'}, ...projects.map(p => ({ value: p.id, label: p.name }))]}
            className="bg-white"
          />
        </fieldset>

        <Button 
          onClick={generateReport}
          leftIcon={<ReportIcon className="w-5 h-5" />} 
          size="lg" 
          disabled={isGenerating || !criteria.template}
          className="w-full sm:w-auto mt-6"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
        {generationError && <p className="text-sm text-red-500 mt-2">{generationError}</p>}
      </div>

      {generatedReport && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">{generatedReport.title}</h3>
            <Button onClick={clearReport} variant="ghost" size="sm">Clear Report</Button>
          </div>
          <p className="text-xs text-text-secondary mb-1">Generated: {new Date(generatedReport.generatedAt).toLocaleString()}</p>
          <p className="text-xs text-text-secondary mb-3">
            Criteria: From {new Date(generatedReport.criteria.startDate).toLocaleDateString()} to {new Date(generatedReport.criteria.endDate).toLocaleDateString()}
            {generatedReport.criteria.projectId !== 'all' && `, Project: ${projects.find(p=>p.id === generatedReport.criteria.projectId)?.name || 'N/A'}`}
          </p>

          {generatedReport.summary && (
            <div className="mb-4 p-3 bg-main-background/40 rounded-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(generatedReport.summary).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-medium text-text-secondary uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-lg font-semibold text-text-primary">{String(value)}</p>
                </div>
              ))}
            </div>
          )}

          {generatedReport.dataRows && generatedReport.dataRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(generatedReport.dataRows[0]).map(header => (
                      <th key={header} scope="col" className="px-3 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedReport.dataRows.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-text-primary">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {generatedReport.message && <p className="text-sm text-text-secondary mt-3">{generatedReport.message}</p>}
          {(!generatedReport.dataRows || generatedReport.dataRows.length === 0) && !generatedReport.message && (
            <p className="text-sm text-text-secondary text-center py-4">No data to display for this report and criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportView;
