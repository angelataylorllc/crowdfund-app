import React from 'react';

const Logo = ({ color }) => {
  return (
    <svg
      className={`w-8 h-8 ${color}`} // Tailwind width and height (8 = 32px)
      viewBox="0 0 24 24" // Keep the viewBox to scale the content within
      strokeLinejoin="round"
      strokeWidth="2"
      strokeLinecap="round"
      strokeMiterlimit="10"
      stroke="currentColor"
      fill="none"
      width="32" // Explicitly set width to 32px
      height="32" // Explicitly set height to 32px
    >
      <rect x="3" y="1" width="7" height="12" />
      <rect x="3" y="17" width="7" height="6" />
      <rect x="14" y="1" width="7" height="6" />
      <rect x="14" y="11" width="7" height="12" />
    </svg>
  );
};

export default Logo;
