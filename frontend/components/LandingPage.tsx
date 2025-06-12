
import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import PartnerPage from './PartnerPage';
import Button from './Button';
import { UserRole } from '../types';
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
  onQuickLoginAsRole: (role: UserRole) => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onQuickLoginAsRole, loginError, isLoading }) => {
  const [displayView, setDisplayView] = useState<LandingDisplayView>('main');

  useEffect(() => {
    document.body.className = 'landing-page-body';
    return () => {
      // App.tsx will set app-body when authenticated user mounts
    };
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
    return 'flex-grow'; // Default for main landing content
  };

  return (
    <div className="flex flex-col min-h-screen bg-landing-bg">
      <LandingHeader onNavigate={handleNavigation} />

      <main className={getMainClass()}>
        {displayView === 'main' && (
          <>
            {/* Hero Section */}
            <LandingSection id="hero-section" bgClassName="bg-gradient-to-br from-main-accent via-secondary-accent to-highlight text-white py-20 sm:py-32" className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fadeInUp">
                Shifted Project: <span className="block sm:inline">Challenging Norms, Expanding Horizons</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                We deliver educational content with a light, creative touch, voicing diverse perspectives and fostering dialogue on often overlooked topics. We invite you to think critically and explore new viewpoints.
              </p>
              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <Button
                  onClick={() => handleNavigation('login')}
                  size="lg"
                  className="bg-white text-main-accent hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  Explore with ShiftedOS
                </Button>
              </div>
            </LandingSection>

            {/* "Our Approach at Shifted Project" Section (Formerly Features) */}
            <LandingSection id="features-section" bgClassName="bg-main-background/20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-primary mb-4">Our Approach at Shifted Project</h2>
              <p className="text-center text-text-secondary text-lg mb-12 sm:mb-16 max-w-2xl mx-auto">
                At Shifted Project, we present educational content creatively, voice diverse opinions without polarization, and provide a space for expression and dialogue on topics often considered taboo or trivial. ShiftedOS helps us achieve this through:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<ProjectIcon className="w-6 h-6" />}
                  title="Unified Project Management"
                  description="Track tasks, manage deadlines, and visualize project progress with Gantt charts. Keep everything organized in one place."
                />
                <FeatureCard
                  icon={<SparklesIcon className="w-6 h-6" />}
                  title="Creative Content Focus"
                  description="Dedicated tools for content creation, including script templates and support for diverse content pillars and formats."
                />
                <FeatureCard
                  icon={<AnalyticsIcon className="w-6 h-6" />}
                  title="Insightful Analytics"
                  description="Gain valuable insights into project performance, team productivity, and content engagement with customizable dashboards."
                />
                <FeatureCard
                  icon={<UsersIcon className="w-6 h-6" />}
                  title="Collaborative Team Workspace"
                  description="Manage team members, assign roles, and foster seamless communication and collaboration across all your projects."
                />
                <FeatureCard
                  icon={<FolderIcon className="w-6 h-6" />}
                  title="Asset & Knowledge Management"
                  description="Centralize your digital assets and build a comprehensive knowledge base for your team's SOPs and guidelines."
                />
                <FeatureCard
                  icon={<FinanceIcon className="w-6 h-6" />}
                  title="Finance & Budgeting Tools"
                  description="Track project expenses, manage budgets, and generate financial summaries to keep your projects on track financially."
                />
              </div>
            </LandingSection>

            {/* "Our Philosophy" Section (Formerly Why ShiftedOS) */}
            <LandingSection id="why-us-section" bgClassName="bg-white">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Our Philosophy</h2>
                <p className="text-text-secondary text-lg mb-12 sm:mb-16 max-w-3xl mx-auto">
                  We aim to be a narrative-based, reflective, and multi-perspective educational medium that shifts young people's views on complex issues.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="animate-slideInLeft">
                  <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Team collaborating" className="rounded-xl shadow-xl"/>
                </div>
                <div className="space-y-8 animate-fadeInUp">
                  <div>
                    <h3 className="text-2xl font-semibold text-main-accent mb-2">Foster Creativity & Open Dialogue</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Our platform is designed to provide space for expression and thoughtful discussion, presenting educational content with a light, creative touch and encouraging diverse viewpoints without polarization.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-main-accent mb-2">Dare to See Differently</h3>
                    <p className="text-text-secondary leading-relaxed">
                      We believe change isn't just about right or wrong, but about the courage to explore perspectives that are often overlooked. Our goal is to invite thought, not to preach.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-main-accent mb-2">Perspective-Shifting Content</h3>
                    <p className="text-text-secondary leading-relaxed">
                      We strive to be a narrative-based, reflective, and multi-perspective educational medium that truly shifts young people's views on complex issues by presenting them in engaging and understandable ways.
                    </p>
                  </div>
                </div>
              </div>
            </LandingSection>

            {/* Call to Action Section */}
            <LandingSection id="cta-section" bgClassName="bg-highlight text-white py-20 sm:py-28">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Experience Shifted Project?</h2>
                <p className="text-indigo-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
                  Use ShiftedOS to manage your projects with clarity, creativity, and impact, and join us in exploring diverse perspectives.
                </p>
                <Button
                  onClick={() => handleNavigation('login')}
                  size="lg"
                  className="bg-white text-highlight hover:bg-gray-100 px-10 py-3.5 text-lg"
                >
                  Access Your Workspace
                </Button>
              </div>
            </LandingSection>
          </>
        )}

        {displayView === 'login' && (
          <LoginScreen onLogin={onLogin} onQuickLoginAsRole={onQuickLoginAsRole} loginError={loginError} isLoading={isLoading} />
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
