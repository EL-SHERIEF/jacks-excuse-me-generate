'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function GenerateButton({ onClick, disabled, loading }: GenerateButtonProps) {
  return (
    <div className="flex justify-center py-8">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={cn(
          'relative px-12 py-6 rounded-2xl font-bold text-xl md:text-2xl transition-all duration-300 overflow-hidden',
          disabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-2xl neon-glow'
        )}
      >
        {loading && (
          <div className="absolute inset-0 shimmer" />
        )}

        <span className="relative flex items-center gap-3">
          <Sparkles className={cn('w-6 h-6', loading && 'animate-spin')} />
          {loading ? 'بفكرلك...' : 'أعذرني'}
        </span>

        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
