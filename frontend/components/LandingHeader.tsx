import React from 'react';
import Button from './Button';
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon'; // Or a dedicated Shifted Project logo

interface LandingHeaderProps {
  onNavigate: (sectionId: 'features' | 'why-us' | 'partner' | 'login') => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigate }) => {
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-landing-header-text hover:bg-white/10 transition-colors";

  return (
    <header className="bg-landing-header-bg sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 flex items-center group">
              <ShiftedOSLogoIcon className="h-8 w-auto text-landing-header-text group-hover:opacity-80 transition-opacity" />
              <span className="ml-3 text-xl font-semibold text-landing-header-text group-hover:opacity-80 transition-opacity">
                Shifted Project Os
              </span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <button onClick={() => onNavigate('features')} className={navLinkClasses}>
                Features
              </button>
              <button onClick={() => onNavigate('why-us')} className={navLinkClasses}>
                Why ShiftedOS
              </button>
              <button onClick={() => onNavigate('partner')} className={navLinkClasses}>
                Partner
              </button>
              <Button 
                onClick={() => onNavigate('login')} 
                variant="ghost" // Will use text-landing-header-text due to parent bg
                className="!text-landing-header-text hover:!bg-white/10 !border-landing-header-text/50"
                size="sm"
              >
                Login to ShiftedOS
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Button 
              onClick={() => onNavigate('login')} 
              variant="ghost" 
              className="!text-landing-header-text hover:!bg-white/10 !border-landing-header-text/50"
              size="sm"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
