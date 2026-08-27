import React from 'react';

const PdfIcon: React.FC<{ style?: React.CSSProperties; className?: string }> = ({ style, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={style}
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2v-3z" />
    <path d="M6 12h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6v-3z" />
  </svg>
);

export default PdfIcon;
