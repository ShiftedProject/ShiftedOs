
import React, { ReactNode } from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-3xl md:max-w-5xl lg:max-w-6xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div> {/* Darker backdrop */}
      <div
        className={`relative bg-main-background rounded-xl shadow-strong overflow-hidden w-full ${sizeClasses[size]} m-0 sm:m-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalAppear`}
        onClick={(e) => e.stopPropagation()}
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-300/70"> {/* Adjusted border color */}
            <h3 id="modal-title" className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 rounded-full hover:bg-gray-500/10" 
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}
        <div className="p-4 sm:p-6 max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto bg-main-background">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;