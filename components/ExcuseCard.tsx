'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ReactionBar } from './ReactionBar';

interface ExcuseCardProps {
  excuse: string;
  excuseId: string;
  onReaction: (type: 'like' | 'share' | 'copy' | 'unlike') => void;
}

export function ExcuseCard({ excuse, excuseId, onReaction }: ExcuseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 neon-border">
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
            Your Excuse
          </h3>
          <p
            className="text-3xl md:text-4xl font-bold text-white leading-relaxed"
            style={{
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1.5'
            }}
          >
            {excuse}
          </p>
        </div>

        <div className="border-t border-gray-700 my-6"></div>

        <ReactionBar excuseId={excuseId} excuse={excuse} onReaction={onReaction} />

      </div>
    </motion.div>
  );
}
