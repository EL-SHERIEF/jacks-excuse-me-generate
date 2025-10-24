'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <Zap className="w-10 h-10 text-[#f6df55]" />
        <h1 className="text-5xl md:text-7xl font-bold text-[#f6df55]">
          مولد الأعذار
        </h1>
        <Zap className="w-10 h-10 text-[#f6df55]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-md text-[#f6df5590] mt-4 max-w-2xl mx-auto"
      >
        مدعوم بتقنية جوجل جيميناي للذكاء الاصطناعي - للترفيه والتعليم فقط
      </motion.p>
    </motion.header>
  );
}
