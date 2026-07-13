"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function SagaLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Box logo thương hiệu - WOW Glassmorphism Edition */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_8px_16px_-4px_rgba(99,102,241,0.4)] border border-white/20 shrink-0 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-[0_16px_32px_-8px_rgba(99,102,241,0.6)] group-hover:-translate-y-1">

        {/* Inner Glass Highlight (Top Left Light reflection) */}
        <div className="absolute inset-0 rounded-xl border-t-2 border-l-2 border-white/30 pointer-events-none" />

        {/* Ambient Glows inside the box for 3D depth */}
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 blur-xl rounded-full" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-white/40 blur-md rounded-full" />

        {/* Animated SVG Graph & Pie */}
        <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rotating Outer Traceability Ring with Nodes */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          >
            <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.4" />
            <circle cx="88" cy="50" r="4.5" fill="white" />
            <circle cx="23" cy="23" r="3" fill="white" opacity="0.8" />
            <circle cx="31" cy="83" r="2.5" fill="white" opacity="0.5" />
          </motion.g>

          {/* Slicing Pie Core (The 'SAGA' Heart) - Perfectly Centered */}
          <g className="origin-center transform transition-transform duration-700 group-hover:scale-[1.15]">
            {/* Quadrant 1 - Top Right */}
            <path d="M 51.5 48.5 L 51.5 20.5 A 28 28 0 0 1 79.5 48.5 Z" fill="white" opacity="0.95" />
            {/* Quadrant 2 - Bottom Left */}
            <path d="M 48.5 51.5 L 20.5 51.5 A 28 28 0 0 0 48.5 79.5 Z" fill="white" opacity="0.8" />
            {/* Quadrant 3 - Bottom Right Sliver */}
            <path d="M 51.5 51.5 L 71.3 71.3 A 28 28 0 0 1 51.5 79.5 Z" fill="white" opacity="0.5" />
          </g>

          {/* Central Core Dot */}
          <circle cx="50" cy="50" r="6" fill="#f97316" className="drop-shadow-sm" />
          <circle cx="50" cy="50" r="2.5" fill="white" />
        </svg>

        {/* Glossy Overlay for 3D effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2 rounded-t-xl pointer-events-none" />

        {/* Glass Reflection Sweep (Triggers on hover) */}
        <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-20 pointer-events-none" />
      </div>

      {showText && (
        <div className="flex flex-col justify-center pl-1">
          <span className="text-[22px] sm:text-[24px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-500 leading-none relative pb-1">
            SAGA
            <span className="text-indigo-500">.</span>
            {/* Animated Underline effect */}
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </span>
        </div>
      )}
    </div>
  );
}
