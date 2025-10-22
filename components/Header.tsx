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
        <Zap className="w-10 h-10 text-pink-500" />
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          مولد الأعذار
        </h1>
        <Zap className="w-10 h-10 text-blue-500" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-300 mb-2 font-medium"
      >
        أقوى مولد أعذار للفريلانسرز بالذكاء الاصطناعي
      </motion.p>


      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto"
      >
        مدعوم بتقنية جوجل جيميناي للذكاء الاصطناعي - للترفيه والتعليم فقط
      </motion.p>
    </motion.header>
  );
}
