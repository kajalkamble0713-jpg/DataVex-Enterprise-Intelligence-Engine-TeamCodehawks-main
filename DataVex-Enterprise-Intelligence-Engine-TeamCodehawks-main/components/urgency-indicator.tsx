"use client";

import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface UrgencyIndicatorProps {
  urgencyFactor: string;
}

export function UrgencyIndicator({ urgencyFactor }: UrgencyIndicatorProps) {
  // Determine urgency level based on keywords
  const getUrgencyLevel = () => {
    const lower = urgencyFactor.toLowerCase();
    
    if (lower.includes('sharp') || lower.includes('critical') || lower.includes('urgent')) {
      return 'high';
    } else if (lower.includes('raised') || lower.includes('growth') || lower.includes('expansion')) {
      return 'medium';
    }
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel();
  
  const styles = {
    high: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
      icon: 'text-orange-400',
      pulse: true
    },
    medium: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
      icon: 'text-yellow-400',
      pulse: false
    },
    low: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]',
      icon: 'text-blue-400',
      pulse: false
    }
  };

  const style = styles[urgencyLevel];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`glass ${style.bg} border ${style.border} ${style.glow} p-4 rounded-xl`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={style.pulse ? { scale: [1, 1.2, 1] } : {}}
          transition={style.pulse ? { duration: 2, repeat: Infinity } : {}}
          className={style.icon}
        >
          <Zap size={24} fill="currentColor" />
        </motion.div>
        <div className="flex-1">
          <div className="font-semibold text-white mb-1 flex items-center gap-2">
            Why Now?
            {urgencyLevel === 'high' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/30 text-orange-300">
                High Priority
              </span>
            )}
          </div>
          <div className="text-sm text-gray-200 leading-relaxed">
            {urgencyFactor}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
