
import React from 'react';

interface IconProps {
  className?: string;
}

const FinanceIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 2.25 4.5h.75A.75.75 0 0 1 3.75 4.5v.75m0 0H21m-18 0h9.521c.577 0 1.071.45 1.123.994l.44 8.211c.053.994.896 1.762 1.905 1.762h4.512c1.01 0 1.852-.768 1.905-1.762l.44-8.211c.053-.544.546-.994 1.123-.994H21M3.75 9h.008v.008H3.75V9Zm0 3h.008v.008H3.75v-.008Zm0 3h.008v.008H3.75v-.008Z" />
  </svg>
);
export default FinanceIcon;
