"use client";

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StockInfoProps {
  stock: {
    ticker: string;
    latestClose: number;
    change1Week: string | null;
    change1Month: string | null;
    change1Year: string | null;
    trend: 'upward' | 'downward' | 'neutral';
    urgencySignal: string;
  };
}

export function StockInfo({ stock }: StockInfoProps) {
  const TrendIcon = stock.trend === 'upward' 
    ? TrendingUp 
    : stock.trend === 'downward' 
    ? TrendingDown 
    : Minus;
    
  const trendColor = stock.trend === 'upward' 
    ? 'text-green-400' 
    : stock.trend === 'downward' 
    ? 'text-red-400' 
    : 'text-gray-400';
    
  const trendBg = stock.trend === 'upward'
    ? 'bg-green-500/10 border-green-500/30'
    : stock.trend === 'downward'
    ? 'bg-red-500/10 border-red-500/30'
    : 'bg-gray-500/10 border-gray-500/30';

  const formatChange = (change: string | null) => {
    if (!change) return null;
    const isPositive = change.startsWith('+');
    return (
      <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
        {change}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass border ${trendBg} p-4 rounded-xl`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendIcon className={trendColor} size={20} />
          <span className="font-mono text-lg font-semibold">{stock.ticker}</span>
        </div>
        <div className="text-sm text-gray-400">
          ${stock.latestClose.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {stock.change1Week && (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">1 Week</div>
            <div className="font-mono text-sm font-semibold">
              {formatChange(stock.change1Week)}
            </div>
          </div>
        )}
        {stock.change1Month && (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">1 Month</div>
            <div className="font-mono text-sm font-semibold">
              {formatChange(stock.change1Month)}
            </div>
          </div>
        )}
        {stock.change1Year && (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">1 Year</div>
            <div className="font-mono text-sm font-semibold">
              {formatChange(stock.change1Year)}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-300 pt-3 border-t border-white/10">
        {stock.urgencySignal}
      </div>
    </motion.div>
  );
}
