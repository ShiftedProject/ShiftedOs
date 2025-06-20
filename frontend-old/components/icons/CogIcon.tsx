
import React from 'react';

interface IconProps {
  className?: string;
}

const CogIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93L15.6 7.23c.398.164.82.164 1.217 0l1.972-.81c.426-.176.904.046 1.078.476l.647 1.766c.174.43-.046.904-.476 1.078l-1.97.81c-.397.164-.397.576 0 .74l1.97.81c.43.174.65.648.476 1.078l-.647 1.766c-.174.43-.652.652-1.078.476l-1.972-.81c-.397-.164-.82-.164-1.217 0l-1.972.81c-.426.176-.904-.046-1.078-.476l-.647-1.766c-.174-.43.046-.904.476-1.078l1.97-.81c.397-.164.397-.576 0-.74l-1.97-.81c-.43-.174-.65-.648-.476-1.078l.647-1.766c.174-.43.652-.652 1.078-.476l1.972.81c.398.164.78.332.78.93l.149.894zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" 
    />
  </svg>
);

export default CogIcon;