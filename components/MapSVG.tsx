
import React from 'react';

export const MapSVG: React.FC = () => {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full bg-oct-50 rounded-xl border border-oct-200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0f2fe" strokeWidth="1"/>
        </pattern>
      </defs>
      
      {/* Background Grid */}
      <rect width="600" height="400" fill="url(#grid)" />
      
      {/* Train Tracks */}
      <g transform="translate(0, 300)">
        <path d="M0 0 L600 0" stroke="#94a3b8" strokeWidth="10" />
        <path d="M0 -15 L600 -15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10,10" />
        <path d="M0 15 L600 15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10,10" />
        <text x="500" y="30" fontSize="12" fill="#64748b" fontWeight="bold">JR 高平線</text>
      </g>
      
      {/* Takahira Station */}
      <g transform="translate(50, 220)">
        <rect width="180" height="100" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
        <text x="90" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">JR 高平駅</text>
        <text x="90" y="75" textAnchor="middle" fontSize="10" fill="#64748b">Takahira Sta.</text>
        {/* Ticket Gates */}
        <rect x="140" y="40" width="10" height="40" fill="#cbd5e1" />
        <text x="160" y="65" fontSize="10" fill="#475569" writingMode="tb">改札</text>
      </g>
      
      {/* Connector Bridge */}
      <path d="M 230 250 L 300 250" stroke="#cbd5e1" strokeWidth="20" />
      
      {/* KUR Kumada Building */}
      <g transform="translate(300, 100)">
        <rect width="200" height="220" rx="8" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="4" />
        <rect x="10" y="10" width="180" height="30" fill="#0ea5e9" rx="4" />
        <text x="100" y="32" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#ffffff">KUR 熊田</text>
        
        {/* Floors */}
        <g transform="translate(20, 60)">
           {/* 6F Target */}
           <rect width="160" height="40" fill="#fff" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" />
           <rect width="160" height="40" fill="#ffe4e6" opacity="0.3" />
           <text x="80" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e11d48">WITRE 高平 (6F)</text>
           <circle cx="10" cy="20" r="4" fill="#e11d48" />
           
           <text x="80" y="65" textAnchor="middle" fontSize="10" fill="#94a3b8">5F 書店 / カフェ</text>
           <text x="80" y="90" textAnchor="middle" fontSize="10" fill="#94a3b8">1F-4F ショッピング</text>
        </g>
      </g>
      
      {/* Library Label/Pin */}
      <g transform="translate(480, 100)">
        <path d="M0 0 L20 -20 L120 -20 L120 20 L20 20 L0 0 Z" fill="#0c4a6e" />
        <text x="70" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">OCT 図書館</text>
      </g>
      
      {/* You are here icon near station */}
      <circle cx="100" cy="350" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="120" y="355" fontSize="12" fontWeight="bold" fill="#ef4444">現在地（南口）</text>

    </svg>
  );
};
