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
          'relative px-12 py-4 rounded-2xl font-bold text-md md:text-lg transition-all duration-300 overflow-hidden',
          disabled
            ? 'bg-[#f6df5510] text-[#f6df5550] cursor-not-allowed'
            : 'bg-[#f6df5550] text-[#0D120E] hover:shadow-2xl neon-glow border-solid bg-[#f6df55] '
        )}
      >
        {loading && (
          <div className="absolute inset-0 shimmer" />
        )}

        <span className="relative flex items-center gap-3">
          <Sparkles className={cn('w-4 h-4', loading && 'animate-spin')} />
          {loading ? 'بفكرلك...' : 'أعذرني'}
        </span>

        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-[#f6df5550] border-[#f6df55] border-1"
          />
        )}
      </motion.button>
    </div>
  );
}
