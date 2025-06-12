
import React from 'react';

interface IconProps {
  className?: string;
}

const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17.437 9.154a4.5 4.5 0 01-3.09-3.09L11.5 3l.813 2.846a4.5 4.5 0 013.09 3.09L18.25 12zM18.25 12l.813 2.846a4.5 4.5 0 013.09 3.09L22.5 21l-.813-2.846a4.5 4.5 0 01-3.09-3.09L15.5 12l2.75-2.846z" />
  </svg>
);
export default SparklesIcon;
