"use client";

import { Target, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SolutionMatchmakerCardProps {
  solution: {
    name: string;
    reason: string;
    features: string[];
  };
}

export function SolutionMatchmakerCard({ solution }: SolutionMatchmakerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-teal-500/10 p-6 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.2)]"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-teal-500/20 border border-violet-500/30">
          <Target className="text-violet-400" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-teal-400" size={16} />
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Recommended Solution
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
            {solution.name}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {solution.reason}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Key Features
        </div>
        {solution.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-2"
          >
            <CheckCircle2 className="text-teal-400 flex-shrink-0 mt-0.5" size={16} />
            <span className="text-sm text-gray-300">{feature}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
      >
        Learn More About This Solution
      </motion.button>
    </motion.div>
  );
}
