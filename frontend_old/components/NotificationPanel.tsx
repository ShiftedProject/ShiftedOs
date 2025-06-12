
import React from 'react';
import { Notification as NotificationType, NotificationIconType } from '../types';
import { NOTIFICATION_ICON_MAP } from '../constants';
import { formatRelativeTime } from '../utils/time';
import Button from './Button';
import XMarkIcon from './icons/XMarkIcon';

interface NotificationPanelProps {
  notifications: NotificationType[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
        className="fixed inset-0 z-40 md:absolute md:inset-auto md:top-16 md:right-4 md:mt-2 transition-opacity duration-300 ease-in-out"
        onClick={onClose} 
    >
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden" // Darker backdrop for mobile
            aria-hidden="true"
        ></div>
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-auto md:right-0 md:transform-none w-[calc(100%-2rem)] sm:w-96 max-h-[70vh] md:max-h-[500px] bg-glass-bg backdrop-blur-xl rounded-xl shadow-strong border border-white/20 flex flex-col overflow-hidden" // Updated glass, border
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/20"> {/* Updated border */}
                <h3 className="text-md sm:text-lg font-semibold text-text-primary">Notifications</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-text-primary transition-colors p-1 -mr-1 rounded-full hover:bg-white/10" // Adjusted hover
                    aria-label="Close notifications"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="p-6 text-center text-text-secondary">
                    <p>No new notifications.</p>
                </div>
            ) : (
                <>
                    <div className="flex-grow overflow-y-auto p-2 sm:p-3 space-y-2">
                        {notifications.map((notification) => {
                            const IconComponent = NOTIFICATION_ICON_MAP[notification.iconType];
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 flex items-start space-x-3
                                        ${notification.read ? 'bg-main-background/30 hover:bg-main-background/50' : 'bg-secondary-accent/20 hover:bg-secondary-accent/30'}`}
                                    onClick={() => onMarkAsRead(notification.id)}
                                >
                                    {!notification.read && <div className="w-2 h-2 bg-highlight rounded-full mt-1.5 flex-shrink-0" title="Unread"></div>}
                                    {notification.read && <div className="w-2 h-2 flex-shrink-0"></div>}
                                    
                                    <IconComponent className={`w-5 h-5 ${notification.read ? 'text-text-secondary' : 'text-main-accent'} flex-shrink-0 mt-0.5`} />
                                    <div className="flex-grow">
                                        <p className={`text-sm ${notification.read ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                                            {notification.message}
                                        </p>
                                        <p className={`text-xs ${notification.read ? 'text-gray-400' : 'text-secondary-accent'}`}>
                                            {formatRelativeTime(notification.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {unreadCount > 0 && (
                        <div className="p-3 sm:p-4 border-t border-white/20"> {/* Updated border */}
                            <Button onClick={onMarkAllAsRead} variant="ghost" size="sm" className="w-full">
                                Mark all as read
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default NotificationPanel;