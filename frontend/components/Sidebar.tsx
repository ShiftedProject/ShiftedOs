import React from 'react';
import { User, UserRole } from '../../types';

// CORRECTED: Importing all icons used in the navItems array below,
// including the missing DocumentTextIcon.
import DashboardIcon from './icons/DashboardIcon';
import ProjectIcon from './icons/ProjectIcon';
import FolderIcon from './icons/FolderIcon';    // For 'Asset Inventory'
import UsersIcon from './icons/UsersIcon';     // For 'Team Management' & 'CRM'
import AnalyticsIcon from './icons/AnalyticsIcon';
import FinanceIcon from './icons/FinanceIcon';
import DocumentTextIcon from './icons/DocumentTextIcon'; // For 'Knowledge Base'
import TargetIcon from './icons/TargetIcon';   // For 'OKRs'
import ChartBarSquareIcon from './icons/ChartBarSquareIcon'; // For 'Reports'
import CogIcon from './icons/CogIcon';         // For 'Admin'
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon';

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
    { id: 'assets', label: 'Asset Inventory', icon: <FolderIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'team', label: 'Team Management', icon: <UsersIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'finance', label: 'Finance', icon: <FinanceIcon />, roles: [UserRole.ADMIN, UserRole.FINANCE] },
    { id: 'crm', label: 'Relations (CRM)', icon: <UsersIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'knowledge', label: 'Knowledge Base', icon: <DocumentTextIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER] },
    { id: 'okr', label: 'OKRs', icon: <TargetIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'reports', label: 'Reports', icon: <ChartBarSquareIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'admin', label: 'Admin Panel', icon: <CogIcon />, roles: [UserRole.ADMIN] },
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
      <div className="flex items-center mb-10 px-4" style={{ height: '4rem' }}>
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
