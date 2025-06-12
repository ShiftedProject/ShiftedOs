
import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
}

const ShiftedOSLogoIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg 
    className={className || "w-16 h-16"} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="ShiftedOS Logo"
  >
    <path 
      d="M20 25 L50 10 L80 25 L80 75 L50 90 L20 75 Z" 
      stroke={color} 
      strokeWidth="5" 
      strokeLinejoin="round" 
      strokeLinecap="round"
    />
    <path 
      d="M50 10 L50 50 M20 25 L50 50 M80 25 L50 50 M50 90 L50 50 M20 75 L50 50 M80 75 L50 50" 
      stroke={color} 
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="50" cy="50" r="8" fill={color} />
  </svg>
);

export default ShiftedOSLogoIcon;
