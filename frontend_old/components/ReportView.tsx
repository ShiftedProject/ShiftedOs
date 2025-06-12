
import React from 'react';
import Button from './Button';
import SelectInput from './SelectInput';
import ReportIcon from './icons/ReportIcon';
import CalendarIcon from './icons/CalendarIcon';
import ProjectIcon from './icons/ProjectIcon';

const ReportView: React.FC = () => {
  const reportTemplates = [
    { id: 'progress', name: 'Weekly Task Progress Report' },
    { id: 'financial', name: 'Monthly Financial Summary' },
    { id: 'productivity', name: 'Team Productivity Overview' },
    { id: 'content', name: 'Content Performance Report' },
  ];

  const recentReports = [
    { id: 'REC001', name: 'Weekly Progress - Wk 42', date: 'Oct 25, 2023', type: 'PDF' },
    { id: 'REC002', name: 'September Financials', date: 'Oct 05, 2023', type: 'CSV' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Report Builder</h2>

      {/* Report Generation Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Generate New Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <SelectInput
            label="Report Template"
            options={reportTemplates.map(rt => ({ value: rt.id, label: rt.name }))}
            placeholder="Select a template..."
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          <div className="relative">
            <label className="block text-sm font-medium text-text-secondary mb-1">Date Range (Coming Soon)</label>
            <div className="flex items-center p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>Select date range</span>
            </div>
          </div>
           <SelectInput
            label="Filter by Project (Coming Soon)"
            options={[{value: 'proj1', label: 'ShiftedOS V2 (Example)'}, {value: 'proj2', label: 'Marketing Campaign (Example)'}]}
            placeholder="All Projects"
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>

        <Button 
          leftIcon={<ReportIcon className="w-5 h-5" />} 
          size="lg" 
          disabled 
          className="w-full sm:w-auto cursor-not-allowed opacity-60"
          title="Report generation coming soon"
        >
          Generate Report
        </Button>
        <p className="text-xs text-text-secondary mt-2">
          Note: Report generation and customization features are currently under development.
        </p>
      </div>

      {/* Recently Generated Reports Placeholder */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Recently Generated Reports</h3>
        {recentReports.length > 0 ? (
          <ul className="space-y-3">
            {recentReports.map((report) => (
              <li key={report.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-main-background/30 rounded-md hover:bg-main-background/50 transition-colors">
                <div>
                  <span className="font-medium text-text-primary">{report.name}</span>
                  <span className="text-xs text-main-accent ml-2 px-1.5 py-0.5 bg-main-accent/10 rounded-full">{report.type}</span>
                </div>
                <span className="text-sm text-text-secondary mt-1 sm:mt-0">{report.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary">No reports generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReportView;
