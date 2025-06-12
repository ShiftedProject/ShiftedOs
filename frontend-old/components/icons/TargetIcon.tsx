
import React from 'react';

interface IconProps {
  className?: string;
}

const TargetIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V3M12 3a9.004 9.004 0 0 0-8.716 6.747M12 3a9.004 9.004 0 0 1 8.716 6.747m-17.432 0h17.432M5.568 3.075A9.007 9.007 0 0 1 12 3m0 18a9.007 9.007 0 0 1-6.432-2.925M20.432 14.253A9.007 9.007 0 0 1 12 21m0-18a9.007 9.007 0 0 0-6.432 2.925M3.568 14.253A9.007 9.007 0 0 0 12 3" />
  </svg>
);
export default TargetIcon;
