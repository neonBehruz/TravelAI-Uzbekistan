import React from 'react';

interface UzbekFlagProps {
  size?: number;
  className?: string;
  rounded?: boolean;
}

export const UzbekFlag: React.FC<UzbekFlagProps> = ({ size = 20, className = '', rounded = true }) => {
  const height = Math.round(size * 0.65);
  return (
    <span
      className={`uzbek-flag-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        borderRadius: rounded ? '3px' : '0px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        width: `${size}px`,
        height: `${height}px`,
        flexShrink: 0
      }}
    >
      <svg
        viewBox="0 0 500 250"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Blue Top Stripe */}
        <rect width="500" height="80" fill="#0099B5" />
        {/* Red Stripe 1 */}
        <rect y="80" width="500" height="5" fill="#CE1126" />
        {/* White Middle Stripe */}
        <rect y="85" width="500" height="80" fill="#FFFFFF" />
        {/* Red Stripe 2 */}
        <rect y="165" width="500" height="5" fill="#CE1126" />
        {/* Green Bottom Stripe */}
        <rect y="170" width="500" height="80" fill="#1EB53A" />
        
        {/* Crescent */}
        <circle cx="50" cy="40" r="22" fill="#FFFFFF" />
        <circle cx="58" cy="40" r="19" fill="#0099B5" />

        {/* 12 Stars */}
        <g fill="#FFFFFF" transform="scale(0.8) translate(15, 2)">
          {/* Row 1: 3 stars */}
          <circle cx="100" cy="22" r="3.5" />
          <circle cx="118" cy="22" r="3.5" />
          <circle cx="136" cy="22" r="3.5" />
          {/* Row 2: 4 stars */}
          <circle cx="82" cy="38" r="3.5" />
          <circle cx="100" cy="38" r="3.5" />
          <circle cx="118" cy="38" r="3.5" />
          <circle cx="136" cy="38" r="3.5" />
          {/* Row 3: 5 stars */}
          <circle cx="64" cy="54" r="3.5" />
          <circle cx="82" cy="54" r="3.5" />
          <circle cx="100" cy="54" r="3.5" />
          <circle cx="118" cy="54" r="3.5" />
          <circle cx="136" cy="54" r="3.5" />
        </g>
      </svg>
    </span>
  );
};
