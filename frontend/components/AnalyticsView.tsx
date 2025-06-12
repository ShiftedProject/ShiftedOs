
import React, { useState, useEffect } from 'react';
import { AnalyticsConfig, AnalyticsMetricConfig } from '../types';
import UserIcon from './icons/UserIcon';
import ProjectIcon from './icons/ProjectIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import EyeIcon from './icons/EyeIcon';

interface MetricCardDisplayData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

const MetricCard: React.FC<MetricCardDisplayData> = ({ title, value, icon, trend, trendColor }) => (
  <div className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth border border-gray-200/50">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm sm:text-md font-medium text-text-secondary">{title}</h3>
      <div className="text-main-accent">{icon}</div>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold text-text-primary">{String(value)}</p>
    {trend && <p className={`text-xs ${trendColor || 'text-green-500'}`}>{trend}</p>}
  </div>
);

const DEFAULT_ANALYTICS_CONFIG_VIEW: AnalyticsConfig = {
  metricVisibility: {
    activeProjects: true,
    tasksCompleted: true,
    totalContentViews: true,
    teamEngagement: true,
  },
  chartType: 'Bar Chart',
};

// Define available metric card templates. These IDs must match keys in metricVisibility in AnalyticsConfig.
// The `value` field here is a placeholder/default if dynamic data isn't provided.
const availableMetricTemplates: { id: keyof AnalyticsConfig['metricVisibility']; title: string; icon: React.ReactNode; trendFormat?: string; trendColor?: string }[] = [
  { id: 'activeProjects', title: "Active Projects", icon: <ProjectIcon className="w-6 h-6" />, trendFormat: "+{X} this month" },
  { id: 'tasksCompleted', title: "Tasks Completed (Last 30d)", icon: <CheckCircleIcon className="w-6 h-6" />, trendFormat: "+{X}% vs prev 30d", trendColor: "text-green-500" },
  { id: 'totalContentViews', title: "Total Content Views", icon: <EyeIcon className="w-6 h-6" />, trendFormat: "{X}% vs prev 30d", trendColor: "text-red-500" }, // Trend can be positive or negative
  { id: 'teamEngagement', title: "Team Engagement", icon: <UserIcon className="w-6 h-6" />, trendFormat: "{X}", trendColor: "text-text-secondary" },
];

interface AnalyticsViewProps {
  initialConfig?: AnalyticsConfig;
  activeProjectsCount: number | string;
  tasksCompletedCount: number | string;
  totalContentViews: number | string;
  teamEngagement: string; // Typically a percentage string
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
    initialConfig,
    activeProjectsCount,
    tasksCompletedCount,
    totalContentViews,
    teamEngagement
}) => {
  const [config, setConfig] = useState<AnalyticsConfig>(initialConfig || DEFAULT_ANALYTICS_CONFIG_VIEW);

  useEffect(() => {
    const loadConfig = () => {
        try {
            const storedConfig = localStorage.getItem('shiftedOSAnalyticsConfig');
            if (storedConfig) {
                setConfig(JSON.parse(storedConfig));
            } else if (initialConfig) {
                setConfig(initialConfig);
            }
        } catch (e) {
            console.error("Failed to load analytics config from localStorage", e);
            if (initialConfig) setConfig(initialConfig);
        }
    };
    loadConfig();
  }, [initialConfig]);

  const dynamicDataMap: Record<string, number | string> = {
    activeProjects: activeProjectsCount,
    tasksCompleted: tasksCompletedCount,
    totalContentViews: totalContentViews,
    teamEngagement: teamEngagement,
  };

  const visibleMetrics: MetricCardDisplayData[] = availableMetricTemplates
    .filter(metricTemplate => config.metricVisibility[metricTemplate.id as keyof AnalyticsConfig['metricVisibility']] !== false)
    .map(metricTemplate => {
        // Placeholder for more complex trend formatting if needed
        let trendText = metricTemplate.trendFormat;
        if (trendText && dynamicDataMap[metricTemplate.id] !== undefined) {
             // Basic trend formatting, can be expanded
            if (metricTemplate.id === 'activeProjects') trendText = `+${Math.floor(Math.random()*5)} this month`; // Mock trend
            else if (metricTemplate.id === 'tasksCompleted') trendText = `+${Math.floor(Math.random()*20)}% vs prev 30d`; // Mock trend
            else if (metricTemplate.id === 'totalContentViews') trendText = `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random()*10)}% vs prev 30d`;
            else if (metricTemplate.id === 'teamEngagement') trendText = "Stable";
        }

        return {
            title: metricTemplate.title,
            value: dynamicDataMap[metricTemplate.id] !== undefined ? dynamicDataMap[metricTemplate.id] : "N/A",
            icon: metricTemplate.icon,
            trend: trendText,
            trendColor: metricTemplate.trendColor,
        };
    });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Analytics & Insights</h2>

      {visibleMetrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleMetrics.map((metricData, index) => (
            <MetricCard 
              key={index} // Using index as key since IDs might not be unique if template is reused for different data
              title={metricData.title} 
              value={metricData.value} 
              icon={metricData.icon} 
              trend={metricData.trend} 
              trendColor={metricData.trendColor} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-glass-depth text-center border border-gray-200/50">
            <p className="text-md text-text-secondary">No metrics selected for display. Visit Admin Panel to customize.</p>
        </div>
      )}
      

      {config.chartType !== 'None' && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
          <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-1">Task Completion Over Time</h3>
          <p className="text-xs text-text-secondary mb-4">Displaying as: <span className="font-medium text-main-accent">{config.chartType}</span> (Placeholder)</p>
          <div className="h-64 sm:h-80 bg-main-background/50 rounded-lg flex items-end justify-around p-4">
            {config.chartType === 'Bar Chart' && [60, 80, 50, 90, 70, 100, 75].map((height, index) => (
              <div key={index} className="bg-main-accent rounded-t-md w-6 sm:w-8 transition-all duration-300 ease-in-out hover:opacity-80" style={{ height: `${height}%` }} title={`Data Point ${index + 1}`}></div>
            ))}
            {config.chartType === 'Line Chart' && (
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points="0,60 16,40 32,70 48,30 64,50 80,20 100,45" fill="none" stroke="var(--color-main-accent)" strokeWidth="2"/>
                </svg>
            )}
            {config.chartType === 'Pie Chart' && (
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-r from-main-accent via-secondary-accent to-highlight mx-auto flex items-center justify-center text-white font-bold">Pie</div>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-2 text-center">Note: This is a static visual representation. Actual chart integration is coming soon.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-glass-depth text-center mt-6 border border-gray-200/50">
        <p className="text-md text-text-secondary">
          Dynamic data is now connected. Implement Firestore queries in App.tsx to feed real-time analytics.
          Analytics display preferences can be set in the Admin Panel.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
