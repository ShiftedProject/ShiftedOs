
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import PlusIcon from './icons/PlusIcon';
import MenuIcon from './icons/MenuIcon';
import BellIcon from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';
import { Notification } from '../types';

interface HeaderProps {
  title: string;
  onPrimaryAction?: () => void; 
  primaryActionButtonLabel?: string; 
  primaryActionIcon?: React.ReactNode;
  isPrimaryActionEnabled?: boolean; // New prop to control button state from App.tsx based on role
  onToggleSidebar: () => void;
  isDesktopSidebarCollapsed?: boolean;
  notifications: Notification[];
  unreadNotificationCount: number;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onPrimaryAction, 
  primaryActionButtonLabel,
  primaryActionIcon,
  isPrimaryActionEnabled = true, // Default to true if not provided
  onToggleSidebar, 
  isDesktopSidebarCollapsed,
  notifications,
  unreadNotificationCount,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead 
}) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const bellIconRef = useRef<HTMLButtonElement>(null);

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node) &&
          bellIconRef.current && !bellIconRef.current.contains(event.target as Node)) {
        setIsNotificationPanelOpen(false);
      }
    };

    if (isNotificationPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationPanelOpen]);


  return (
    <header className="sticky top-0 z-20 bg-glass-bg backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 shadow-lg"> 
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar} 
            className="md:hidden text-text-primary hover:text-main-accent mr-3 p-1 -ml-1"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">{title}</h2>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {onPrimaryAction && primaryActionButtonLabel && isPrimaryActionEnabled && ( 
            <Button 
              onClick={onPrimaryAction} 
              leftIcon={primaryActionIcon || <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />} 
              size="md" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
              disabled={!isPrimaryActionEnabled} // Explicitly disable if action not enabled
              title={!isPrimaryActionEnabled ? "Action not available for your role" : primaryActionButtonLabel}
            >
              {primaryActionButtonLabel}
            </Button>
          )}
          <div className="relative">
            <button
              ref={bellIconRef}
              onClick={toggleNotificationPanel}
              className="relative p-1.5 rounded-full text-text-primary hover:bg-main-accent/10 hover:text-main-accent transition-colors"
              aria-label={`View notifications (${unreadNotificationCount} unread)`}
            >
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 transform -translate-y-1/3 translate-x-1/3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-highlight justify-center items-center text-white text-[0.5rem] sm:text-[0.6rem] leading-none">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                </span>
              )}
            </button>
            <div ref={notificationPanelRef}>
              <NotificationPanel
                isOpen={isNotificationPanelOpen}
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onClose={() => setIsNotificationPanelOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
