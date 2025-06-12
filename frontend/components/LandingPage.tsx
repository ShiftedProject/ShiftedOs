import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import PartnerPage from './PartnerPage';
import Button from './Button';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';

// Icons for feature sections
import ProjectIcon from './icons/ProjectIcon';
import SparklesIcon from './icons/SparklesIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import UsersIcon from './icons/UsersIcon';
import FolderIcon from './icons/FolderIcon';
import FinanceIcon from './icons/FinanceIcon';

interface LandingPageProps {
  onLogin: (email: string, pass: string) => void;
  loginError?: string;
  isLoading?: boolean;
}

type LandingDisplayView = 'main' | 'login' | 'partner';

const LandingSection: React.FC<{ id?: string, children: React.ReactNode, className?: string, bgClassName?: string }> = ({ id, children, className = '', bgClassName = 'py-16 sm:py-24' }) => (
  <section id={id} className={`${bgClassName} ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-landing-primary-cta/10 text-landing-primary-cta rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-landing-text mb-2">{title}</h3>
    <p className="text-text-secondary text-base leading-relaxed">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, loginError, isLoading }) => {
  const [displayView, setDisplayView] = useState<LandingDisplayView>('main');

  useEffect(() => {
    document.body.className = 'landing-page-body';
    return () => {};
  }, []);

  const handleNavigation = (sectionId: 'features' | 'why-us' | 'partner' | 'login' | 'top') => {
    if (sectionId === 'login') {
      setDisplayView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'partner') {
      setDisplayView('partner');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'top') {
        setDisplayView('main');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setDisplayView('main'); 
      setTimeout(() => {
        const element = document.getElementById(`${sectionId}-section`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
    }
  };

  const getMainClass = () => {
    if (displayView === 'login' || displayView === 'partner') {
      return 'flex-grow flex items-center justify-center py-12 bg-slate-50';
    }
    return 'flex-grow';
  };

  return (
    <div className="flex flex-col min-h-screen bg-landing-bg">
      <LandingHeader onNavigate={handleNavigation} />

      <main className={getMainClass()}>
        {displayView === 'main' && (
          <>
            <LandingSection id="hero-section" bgClassName="bg-gradient-to-br from-main-accent via-secondary-accent to-highlight text-white py-20 sm:py-32" className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fadeInUp">
                Shifted Project: <span className="block sm:inline">Challenging Norms, Expanding Horizons</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                We deliver educational content with a light, creative touch, voicing diverse perspectives and fostering dialogue on often overlooked topics.
              </p>
              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <Button onClick={() => handleNavigation('login')} size="lg" className="bg-white text-main-accent hover:bg-gray-100 px-8 py-3 text-lg">
                  Access Your Workspace
                </Button>
              </div>
            </LandingSection>
            
            <LandingSection id="features-section" bgClassName="bg-main-background/20">
               <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-primary mb-4">Our Approach at Shifted Project</h2>
               <p className="text-center text-text-secondary text-lg mb-12 sm:mb-16 max-w-2xl mx-auto">
                 ShiftedOS helps us achieve our mission through:
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <FeatureCard icon={<ProjectIcon className="w-6 h-6" />} title="Unified Project Management" description="Track tasks, manage deadlines, and visualize project progress." />
                 <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Creative Content Focus" description="Dedicated tools for content creation, including script templates." />
                 <FeatureCard icon={<AnalyticsIcon className="w-6 h-6" />} title="Insightful Analytics" description="Gain valuable insights into project performance and engagement." />
                 <FeatureCard icon={<UsersIcon className="w-6 h-6" />} title="Collaborative Team Workspace" description="Manage team members, assign roles, and foster seamless communication." />
                 <FeatureCard icon={<FolderIcon className="w-6 h-6" />} title="Asset & Knowledge Management" description="Centralize your digital assets and build a knowledge base." />
                 <FeatureCard icon={<FinanceIcon className="w-6 h-6" />} title="Finance & Budgeting Tools" description="Track project expenses and manage budgets." />
               </div>
            </LandingSection>
          </>
        )}

        {displayView === 'login' && (
          <LoginScreen onLogin={onLogin} loginError={loginError} isLoading={isLoading} />
        )}

        {displayView === 'partner' && (
           <div className="w-full"> 
             <PartnerPage />
          </div>
        )}
      </main>

      <LandingFooter onNavigate={handleNavigation} />
    </div>
  );
};

export default LandingPage;
// checking