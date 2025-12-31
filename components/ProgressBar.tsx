
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 to 100
  color: string;
  height?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, height = "h-2", label }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400 font-medium">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{Math.round(value)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-800/50 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}80`
          }}
        />
      </div>
    </div>
  );
};
