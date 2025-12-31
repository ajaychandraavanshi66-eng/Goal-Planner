
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  borderColor = "rgba(255,255,255,0.1)",
  hoverEffect = true
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, y: -4 } : {}}
      className={`glass rounded-2xl p-6 relative overflow-hidden transition-shadow duration-300 ${className}`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      <div className="relative z-10">{children}</div>
      {/* Subtle background glow */}
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 blur-3xl rounded-full opacity-20 pointer-events-none"
        style={{ backgroundColor: borderColor }}
      ></div>
    </motion.div>
  );
};
