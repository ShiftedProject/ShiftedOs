import React from 'react';
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon';

interface LandingFooterProps {
  onNavigate: (sectionId: 'partner' | 'login' | 'top') => void;
}


const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-landing-footer-bg text-landing-footer-text py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0">
            <button onClick={() => onNavigate('top')} className="flex items-center group mb-2">
              <ShiftedOSLogoIcon className="h-8 w-auto text-landing-footer-text group-hover:opacity-80 transition-opacity" />
              <span className="ml-3 text-lg font-semibold text-white group-hover:opacity-80 transition-opacity">Shifted Project Os</span>
            </button>
            <p className="text-sm">&copy; {new Date().getFullYear()} ShiftedProject.ID. All rights reserved.</p>
          </div>
          
          <div>
            <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Product</h5>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => document.getElementById('why-us-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Why ShiftedOS</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">Login</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Company</h5>
            <ul className="space-y-2">
               <li><button onClick={() => document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">About Shifted Project</button></li>
              <li><button onClick={() => onNavigate('partner')} className="hover:text-white transition-colors">Partner With Us</button></li>
              {/* Add more links if needed: Careers, Press etc. */}
            </ul>
          </div>
          
          <div>
            <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Connect</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">GitHub (Placeholder)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter (Placeholder)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn (Placeholder)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
