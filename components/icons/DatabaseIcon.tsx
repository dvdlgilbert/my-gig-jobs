import React from 'react';

// FIX: Replaced invalid content with a valid SVG icon component.
const DatabaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M12 3c-4.42 0-8 1.79-8 4v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 18c-3.31 0-6-1.34-6-3V8.83c.71.38 1.62.7 2.65.91.43.08.88.13 1.35.15V12h4v-2.1c.47-.02.92-.07 1.35-.15C16.38 9.53 17.29 9.2 18 8.83V18c0 1.66-2.69 3-6 3zm0-13c-3.31 0-6-1.34-6-3s2.69-3 6-3 6 1.34 6 3-2.69 3-6 3z"/>
  </svg>
);

export default DatabaseIcon;
