
import React from 'react';
import UserIcon from './icons/UserIcon';
import ProjectIcon from './icons/ProjectIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import EyeIcon from './icons/EyeIcon';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: string; trendColor?: string }> = ({ title, value, icon, trend, trendColor }) => (
  <div className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth border border-gray-200/50">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm sm:text-md font-medium text-text-secondary">{title}</h3>
      <div className="text-main-accent">{icon}</div>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold text-text-primary">{value}</p>
    {trend && <p className={`text-xs ${trendColor || 'text-green-500'}`}>{trend}</p>}
  </div>
);

const AnalyticsView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Analytics & Insights</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard title="Active Projects" value="12" icon={<ProjectIcon className="w-6 h-6" />} trend="+2 this month" />
        <MetricCard title="Tasks Completed (Last 30d)" value="158" icon={<CheckCircleIcon className="w-6 h-6" />} trend="+15% vs prev 30d" trendColor="text-green-500" />
        <MetricCard title="Total Content Views" value="25.6K" icon={<EyeIcon className="w-6 h-6" />} trend="-5% vs prev 30d" trendColor="text-red-500" />
        <MetricCard title="Team Engagement" value="85%" icon={<UserIcon className="w-6 h-6" />} trend="Stable" trendColor="text-text-secondary" />
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Task Completion Over Time (Placeholder Chart)</h3>
        <div className="h-64 sm:h-80 bg-main-background/50 rounded-lg flex items-end justify-around p-4">
          {[60, 80, 50, 90, 70, 100, 75].map((height, index) => (
            <div key={index} className="bg-main-accent rounded-t-md w-6 sm:w-8 transition-all duration-300 ease-in-out hover:opacity-80" style={{ height: `${height}%` }} title={`Data Point ${index + 1}`}></div>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-2 text-center">Note: This is a static visual representation. Actual chart integration is coming soon.</p>
      </div>

      {/* Recent Activity / Top Content Placeholder */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Top Performing Content (Placeholder)</h3>
        <ul className="space-y-3">
          {['"The Future of Work" - Blog Post', '"ShiftedOS V2 Launch" - Video', '"AI in Creative Industries" - Infographic'].map((item, index) => (
            <li key={index} className="text-sm text-text-secondary p-3 bg-main-background/30 rounded-md hover:bg-main-background/50 transition-colors">
              {item} - <span className="text-main-accent font-medium">1.2K Views</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-glass-depth text-center mt-6 border border-gray-200/50">
        <p className="text-md text-text-secondary">
          Full data integration and interactive visualizations are under development.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
