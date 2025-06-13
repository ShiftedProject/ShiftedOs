import React from 'react';
import { User, UserRole } from '../types';

// Import icons...
import DashboardIcon from './icons/DashboardIcon';
import ProjectIcon from './icons/ProjectIcon';
import FolderIcon from './icons/FolderIcon';
import UsersIcon from './icons/UsersIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import FinanceIcon from './icons/FinanceIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import TargetIcon from './icons/TargetIcon';
import ChartBarSquareIcon from './icons/ChartBarSquareIcon';
import CogIcon from './icons/CogIcon';
import LogoutIcon from './icons/LogoutIcon'; // Assuming LogoutIcon exists
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon';

interface SidebarProps {
  activeView: string;
  setActiveView: (viewId: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isDesktopSidebarCollapsed: boolean;
  toggleDesktopSidebarCollapse: () => void;
  currentUser: User | null;
  onLogout: () => void; // Add the onLogout prop
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isDesktopSidebarCollapsed,
  toggleDesktopSidebarCollapse,
  currentUser,
  onLogout, // Receive the onLogout function
}) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.VIEWER, UserRole.FINANCE, UserRole.PROJECT_MANAGER] },
    { id: 'tasks', label: 'Projects & Tasks', icon: <ProjectIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.VIEWER, UserRole.FINANCE, UserRole.PROJECT_MANAGER] },
    { id: 'assets', label: 'Asset Inventory', icon: <FolderIcon />, roles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER] },
    { id: 'team', label: 'Team Management', icon: <UsersIcon />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    // Add other nav items...
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

      <div className="mt-auto p-2 border-t border-gray-200">
         <button
            onClick={onLogout} // Call the onLogout function passed from App.tsx
            className="w-full flex items-center p-3 rounded-lg text-text-secondary hover:bg-red-100 hover:text-red-600"
            title="Logout"
          >
           <span className="w-6 h-6"><LogoutIcon /></span>
            {!isDesktopSidebarCollapsed && (
              <span className="ml-4 font-medium">Logout</span>
            )}
        </button>
      </div>
    </>
  );

  return (
    // ... your mobile and desktop sidebar JSX ...
    // This part remains the same
  );
};

export default Sidebar;
