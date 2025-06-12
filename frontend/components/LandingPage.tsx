
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import AboutShiftedProject from './AboutShiftedProject';
import PartnerPage from './PartnerPage';
import Button from './Button';
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon'; // Re-using ShiftedOS for consistency, can be replaced

interface LandingPageProps {
  onLogin: (email: string, pass: string) => void;
  loginError?: string;
  isLoading?: boolean; // New prop for login loading state
}

type LandingView = 'about' | 'partner' | 'login';

const LandingHeader: React.FC<{ activeView: LandingView, setActiveView: (view: LandingView) => void }> = ({ activeView, setActiveView }) => {
  const navItemClasses = (view: LandingView) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${activeView === view 
       ? 'bg-main-accent text-white shadow-md' 
       : 'text-text-secondary hover:text-main-accent hover:bg-main-accent/10'
     }`;

  return (
    <header className="bg-glass-bg backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Using ShiftedOSLogoIcon for now, replace with a dedicated Shifted Project logo if available */}
              <ShiftedOSLogoIcon className="h-8 w-auto text-main-accent" />
              <span className="ml-2 text-xl font-bold text-text-primary">Shifted Project</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => setActiveView('about')} className={navItemClasses('about')}>
                About Us
              </button>
              <button onClick={() => setActiveView('partner')} className={navItemClasses('partner')}>
                Partner With Us
              </button>
              <button onClick={() => setActiveView('login')} className={navItemClasses('login')}>
                Login to ShiftedOS
              </button>
            </div>
          </div>
          <div className="md:hidden"> {/* Mobile menu button could be added here if needed */}
             <Button onClick={() => setActiveView('login')} variant="primary" size="sm">Login</Button>
          </div>
        </div>
      </nav>
    </header>
  );
};


const LandingPage: React.FC<LandingPageProps> = ({ onLogin, loginError, isLoading }) => {
  const [activeView, setActiveView] = useState<LandingView>('about');

  const renderContent = () => {
    switch (activeView) {
      case 'about':
        return <AboutShiftedProject />;
      case 'partner':
        return <PartnerPage />;
      case 'login':
        return <LoginScreen onLogin={onLogin} loginError={loginError} isLoading={isLoading} />;
      default:
        return <AboutShiftedProject />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-main-background">
      <LandingHeader activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="py-6 bg-main-background text-center text-xs text-text-secondary border-t border-gray-200">
        &copy; {new Date().getFullYear()} ShiftedProject.ID. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
