import React from 'react';

export const PharmacologicalSvg: React.FC = () => {
  return (
    <svg className="w-full h-full p-6 select-none" fill="none" viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="medEmeraldGrad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#147D64" />
          <stop offset="100%" stopColor="#00513F" />
        </linearGradient>
        <linearGradient id="medTealGrad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#88F2DE" />
          <stop offset="100%" stopColor="#147D64" />
        </linearGradient>
        <linearGradient id="medGlassGrad" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E2F1EC" stopOpacity="0.5" />
        </linearGradient>
        <filter height="140%" id="softGlow" width="140%" x="-20%" y="-20%">
          <feGaussianBlur result="blur" stdDeviation="8" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Molecular connecting nodes and telemetry lines */}
      <path d="M 80 180 Q 150 140 230 190 T 380 140" opacity="0.6" stroke="#BDC9C3" strokeDasharray="4 6" strokeWidth="2" />
      <path d="M 120 280 Q 220 250 320 280" opacity="0.4" stroke="#BDC9C3" strokeDasharray="4 6" strokeWidth="2" />

      {/* Floating Particle Nodes */}
      <circle cx="90" cy="176" fill="#147D64" opacity="0.7" r="6" />
      <circle cx="370" cy="142" fill="#88F2DE" r="5" />
      <circle cx="310" cy="278" fill="#147D64" opacity="0.5" r="7" />

      {/* Prescription Bottle Minimalist Geometry */}
      <g transform="translate(190, 80)">
        <ellipse cx="65" cy="210" fill="#111E1B" opacity="0.08" rx="55" ry="14" />
        <rect fill="#D7E6E1" height="14" rx="4" width="46" x="42" y="10" />
        <rect fill="#FFFFFF" filter="url(#softGlow)" height="10" rx="3" width="58" x="36" y="2" />
        <rect fill="#E2F1EC" height="10" rx="3" width="58" x="36" y="2" />
        <rect fill="url(#medGlassGrad)" height="175" rx="14" width="86" x="22" y="24" />
        <rect fill="#FFFFFF" fillOpacity="0.75" height="167" rx="10" width="78" x="26" y="28" />
        
        {/* Shield Icon */}
        <rect fill="#FFFFFF" height="96" rx="8" width="62" x="34" y="60" />
        <path d="M 65 80 L 80 87 C 80 108 65 119 65 119 C 65 119 50 108 50 87 Z" fill="url(#medEmeraldGrad)" />
        <path d="M 62 95 L 68 95 M 65 92 L 65 98" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.5" />
        <rect fill="#D7E6E1" height="4" rx="2" width="46" x="42" y="128" />
        <rect fill="#D7E6E1" height="3" rx="1.5" width="34" x="48" y="136" />
      </g>

      {/* Capsule Pill (Left) */}
      <g transform="translate(70, 75) rotate(-28)">
        <ellipse cx="40" cy="98" fill="#111E1B" opacity="0.06" rx="28" ry="8" />
        <rect fill="url(#medEmeraldGrad)" height="46" rx="22" width="44" x="18" y="10" />
        <rect fill="#FFFFFF" fillOpacity="0.9" height="46" rx="22" width="44" x="18" y="46" />
        <path d="M 26 22 Q 28 45 28 65" opacity="0.6" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3" />
      </g>

      {/* Second Tablet (Right) */}
      <g transform="translate(305, 175) rotate(22)">
        <ellipse cx="35" cy="85" fill="#111E1B" opacity="0.05" rx="26" ry="7" />
        <rect fill="url(#medTealGrad)" height="36" rx="19" width="38" x="16" y="10" />
        <rect fill="#E8F7F2" height="36" rx="19" width="38" x="16" y="40" />
        <line stroke="#BDC9C3" strokeWidth="1.5" x1="16" x2="54" y1="40" y2="40" />
        <path d="M 22 20 Q 24 38 24 55" opacity="0.5" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.5" />
      </g>

      {/* Floating Micro-Badge: Risk Analysis Metric */}
      <g transform="translate(280, 45)">
        <rect fill="#FFFFFF" filter="url(#softGlow)" height="48" rx="10" width="145" />
        <rect fill="#FFFFFF" height="48" rx="10" width="145" />
        <circle cx="24" cy="24" fill="#E8F6F0" r="10" />
        <path d="M 20 24 L 23 27 L 29 20" stroke="#147D64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <text fill="#111E1B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700" x="42" y="21">
          Safety AI Checked
        </text>
        <text fill="#3E4944" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" x="42" y="34">
          86 clash types mapped
        </text>
      </g>

      {/* Floating Micro-Badge: Metabolic Pathway */}
      <g transform="translate(35, 235)">
        <rect fill="#FFFFFF" height="44" rx="10" width="150" />
        <circle cx="22" cy="22" fill="#FFDDB6" r="8" />
        <circle cx="22" cy="22" fill="#9A6300" r="3" />
        <text fill="#111E1B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700" x="38" y="20">
          Safe Breakdown
        </text>
        <text fill="#794D00" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" x="38" y="32">
          Body absorption scan
        </text>
      </g>
    </svg>
  );
};
