
import React from 'react';

interface IconProps {
  className?: string;
}

const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.66M18 18.72V7.5M18 7.5S17.209 6 15 6M9 18.72a9.094 9.094 0 013.741-.479 3 3 0 013.741 5.66M9 18.72V7.5M9 7.5S9.791 6 12 6M3 18.72a9.094 9.094 0 013.741-.479 3 3 0 013.741 5.66M3 18.72V7.5M3 7.5S3.791 6 6 6m4.5 9a4.5 4.5 0 11.88-5.836M15 12a4.5 4.5 0 11-8.36-2.909M3.75 12a4.5 4.5 0 118.36-2.909" />
  </svg>
);
export default UsersIcon;
