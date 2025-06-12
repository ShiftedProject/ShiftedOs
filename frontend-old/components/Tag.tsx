
import React from 'react';
import { Division, ContentPillar, TaskStatus } from '../types';

interface TagProps {
  text: string;
  color?: 'main' | 'secondary' | 'highlight' | 'status' | 'division' | 'pillar' | 'custom';
  status?: TaskStatus; // To determine color based on status
  division?: Division;
  pillar?: ContentPillar;
  className?: string;
  size?: 'sm' | 'md';
  customColorClass?: string; // For fully custom bg/text colors
}

const Tag: React.FC<TagProps> = ({ 
  text, 
  color = 'secondary', 
  status, 
  division, 
  pillar, 
  className = '', 
  size = 'sm',
  customColorClass 
}) => {
  let bgColor = 'bg-secondary-accent'; // Default to secondary accent
  let textColor = 'text-white';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  if (customColorClass) {
    // Use custom class if provided
  } else if (color === 'main') {
    bgColor = 'bg-main-accent';
  } else if (color === 'highlight') {
    bgColor = 'bg-highlight';
  } else if (color === 'status' && status) {
    switch (status) {
      case TaskStatus.TODO: bgColor = 'bg-gray-400'; textColor = 'text-gray-800'; break;
      case TaskStatus.IN_PROGRESS: bgColor = 'bg-blue-500'; break; // Using a generic blue for visibility
      case TaskStatus.IN_REVIEW: bgColor = 'bg-yellow-400'; textColor = 'text-yellow-800'; break;
      case TaskStatus.BLOCKED: bgColor = 'bg-red-500'; break;
      case TaskStatus.DONE: bgColor = 'bg-green-500'; break;
      case TaskStatus.PUBLISHED: bgColor = 'bg-purple-600'; break; // Distinct purple
      default: bgColor = 'bg-gray-300'; textColor = 'text-gray-800';
    }
  } else if (color === 'division' && division) {
     // Using a darker shade of main accent for divisions
     bgColor = 'bg-main-accent opacity-80'; // Example: bg-opacity
  } else if (color === 'pillar' && pillar) {
     // Using a darker shade of secondary accent for pillars
     bgColor = 'bg-secondary-accent opacity-80';
  }


  return (
    <span className={`inline-block ${customColorClass ? customColorClass : `${bgColor} ${textColor}`} ${sizeStyles[size]} font-medium rounded-full whitespace-nowrap ${className}`}>
      {text}
    </span>
  );
};

export default Tag;