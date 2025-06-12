
import React from 'react';
import ProjectIcon from './icons/ProjectIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import FinanceIcon from './icons/FinanceIcon';
import KnowledgeIcon from './icons/KnowledgeIcon';
import TargetIcon from './icons/TargetIcon';
import ReportIcon from './icons/ReportIcon';
import UserIcon from './icons/UserIcon'; // For CRM
import ChevronDoubleLeftIcon from './icons/ChevronDoubleLeftIcon';
import ChevronDoubleRightIcon from './icons/ChevronDoubleRightIcon';
// import ChartBarSquareIcon from './icons/ChartBarSquareIcon'; // No longer top-level
import FolderIcon from './icons/FolderIcon'; 
import UsersIcon from './icons/UsersIcon'; 

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean; // For desktop collapsed state
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`flex items-center w-full py-3 rounded-lg transition-all duration-150 group
                ${isCollapsed ? 'md:px-3 md:justify-center' : 'px-4'}
                ${active 
                    ? 'bg-main-accent text-white shadow-md hover:bg-main-accent/90' // Added hover effect for active item
                    : 'text-text-secondary hover:bg-main-accent/10 hover:text-main-accent'
                }`}
  >
    <span className={`${isCollapsed ? 'md:mr-0' : 'mr-3'} group-hover:scale-110 transition-transform`}>{icon}</span>
    <span className={`${isCollapsed ? 'md:hidden' : 'block'}`}>{label}</span>
  </button>
);

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isDesktopSidebarCollapsed: boolean;
  toggleDesktopSidebarCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isMobileSidebarOpen, 
  setIsMobileSidebarOpen,
  isDesktopSidebarCollapsed,
  toggleDesktopSidebarCollapse
}) => {
  const navItems = [
    { id: 'tasks', label: 'Projects & Tasks', icon: <ProjectIcon className="w-5 h-5" /> },
    // { id: 'gantt', label: 'Gantt Chart', icon: <ChartBarSquareIcon className="w-5 h-5" /> }, // Removed
    { id: 'analytics', label: 'Analytics & Insights', icon: <AnalyticsIcon className="w-5 h-5" /> },
    { id: 'finance', label: 'Finance & Budgeting', icon: <FinanceIcon className="w-5 h-5" /> },
    { id: 'assets', label: 'Asset Inventory', icon: <FolderIcon className="w-5 h-5" /> }, 
    { id: 'team', label: 'Team Management', icon: <UsersIcon className="w-5 h-5" /> }, 
    { id: 'crm', label: 'Relations & Collaborators', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <KnowledgeIcon className="w-5 h-5" /> },
    { id: 'okr', label: 'Objectives & OKRs', icon: <TargetIcon className="w-5 h-5" /> },
    { id: 'reports', label: 'Report Builder', icon: <ReportIcon className="w-5 h-5" /> },
  ];

  const handleItemClick = (viewId: string) => {
    setActiveView(viewId);
    if (window.innerWidth < 768) { // md breakpoint
        setIsMobileSidebarOpen(false);
    }
  }

  return (
    <>
      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" // Darker backdrop
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <div 
        className={`h-full bg-glass-bg backdrop-blur-xl border-r border-white/20 p-4 fixed top-0 left-0 shadow-xl flex flex-col z-40
                    transition-all duration-300 ease-in-out 
                    md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${isDesktopSidebarCollapsed ? 'md:w-20' : 'w-64'}`}
      >
        <div className={`mb-6 transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed ? 'md:opacity-0 md:h-0 md:overflow-hidden md:p-0 md:mb-2' : 'md:opacity-100 md:h-auto'}`}>
          <h1 className="text-3xl font-bold text-main-accent text-center md:text-left">ShiftedOS</h1>
          <p className="text-xs text-text-secondary text-center md:text-left">by ShiftedProject.ID</p>
        </div>
        <nav className="flex-grow space-y-1.5 overflow-y-auto"> {/* Added overflow-y-auto for many items */}
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeView === item.id}
              onClick={() => handleItemClick(item.id)}
              isCollapsed={isDesktopSidebarCollapsed}
            />
          ))}
        </nav>
        
        <div className={`mt-auto border-t border-white/20 pt-3 space-y-1.5 ${isDesktopSidebarCollapsed ? 'md:border-none md:pt-1' : ''}`}>
           <NavItem 
            icon={<UserIcon className="w-5 h-5" />} 
            label="User Profile" 
            onClick={() => handleItemClick('profile')}
            isCollapsed={isDesktopSidebarCollapsed}
            active={activeView === 'profile'}
            />
        </div>

        {/* Desktop Sidebar Collapse Toggle */}
        <div className={`hidden md:block mt-3 pt-3 ${isDesktopSidebarCollapsed ? '' : 'border-t border-white/20'}`}>
            <button
                onClick={toggleDesktopSidebarCollapse}
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-text-secondary hover:bg-main-accent/10 hover:text-main-accent transition-colors duration-150 group"
                title={isDesktopSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isDesktopSidebarCollapsed ? 
                    <ChevronDoubleRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform" /> : 
                    <ChevronDoubleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;