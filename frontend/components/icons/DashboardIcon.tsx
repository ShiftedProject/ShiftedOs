import React from 'react';
import { User, UserRole } from '../types';

// CORRECTED: Import all the necessary icons from the './icon' directory
import DashboardIcon from './icon/DashboardIcon';
import ProjectIcon from './icon/ProjectIcon';
import AssetIcon from './icon/AssetIcon';
import TeamIcon from './icon/TeamIcon';
import AnalyticsIcon from './icon/AnalyticsIcon';
import FinanceIcon from './icon/FinanceIcon';
import CrmIcon from './icon/CrmIcon';
import KnowledgeIcon from './icon/KnowledgeIcon';
import OkrIcon from './icon/OkrIcon';
import ReportIcon from './icon/ReportIcon';
import AdminIcon from './icon/AdminIcon';
import LogoutIcon from './icon/LogoutIcon';
import ShiftedOSLogoIcon from './icon/ShiftedOSLogoIcon';

// Define the props that this component receives from App.tsx
interface SidebarProps {
  activeView: string;
  setActiveView: (viewId: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isDesktopSidebarCollapsed: boolean;
  toggleDesktopSidebarCollapse: () => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isDesktopSidebarCollapsed,
  toggleDesktopSidebarCollapse,
  currentUser,
}) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.VIEWER, UserRole.FINANCE, UserRole.PROJECT_MANAGER] },
    { id: 'tasks', label: 'Projects & Tasks', icon: <ProjectIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.VIEWER, UserRole.FINANCE, UserRole.PROJECT_MANAGER] },
    { id: 'assets', label: 'Asset Inventory', icon: <AssetIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'team', label: 'Team Management', icon: <TeamIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'finance', label: 'Finance', icon: <FinanceIcon />, roles: [UserRole.ADMIN, UserRole.FINANCE] },
    { id: 'crm', label: 'Relations (CRM)', icon: <CrmIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'knowledge', label: 'Knowledge Base', icon: <KnowledgeIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER] },
    { id: 'okr', label: 'OKRs', icon: <OkrIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'reports', label: 'Reports', icon: <ReportIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'admin', label: 'Admin Panel', icon: <AdminIcon />, roles: [UserRole.ADMIN] },
  ];

  const handleNavigation = (viewId: string) => {
    setActiveView(viewId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };
  
  const filteredNavItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  const sidebarContent = (
    <>
      <div className="flex items-center mb-10 px-4" style={{ height: '4rem' /* Equivalent to h-16 */ }}>
        <ShiftedOSLogoIcon className="h-10 w-10 text-main-accent" />
        {!isDesktopSidebarCollapsed && (
          <span className="ml-3 text-2xl font-bold text-text-primary">ShiftedOS</span>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-main-accent text-white shadow-md'
                : 'text-text-secondary hover:bg-main-accent/10 hover:text-text-primary'
            } ${isDesktopSidebarCollapsed ? 'justify-center' : ''}`}
            title={item.label}
          >
            <span className="w-6 h-6">{item.icon}</span>
            {!isDesktopSidebarCollapsed && (
              <span className="ml-4 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-2">
         <button
            onClick={toggleDesktopSidebarCollapse}
            className="w-full hidden md:flex items-center p-3 rounded-lg text-text-secondary hover:bg-main-accent/10 hover:text-text-primary"
            title={isDesktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
           <span className="w-6 h-6">{/* Add collapse/expand icon here */}</span>
            {!isDesktopSidebarCollapsed && (
              <span className="ml-4 font-medium">Collapse</span>
            )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity md:hidden ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isDesktopSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
