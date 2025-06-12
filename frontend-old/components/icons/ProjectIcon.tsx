
import React from 'react';

interface IconProps {
  className?: string;
}

const ProjectIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6.75h.008v.008H5.25v-.008Zm0 5.25h.008v.008H5.25v-.008Zm0 5.25h.008v.008H5.25v-.008Zm13.5-5.25h.008v.008h-.008v-.008Zm0 5.25h.008v.008h-.008v-.008Zm0-10.5h.008v.008h-.008V6.75Z" />
  </svg>
);
export default ProjectIcon;
