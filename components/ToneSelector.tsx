'use client';

import { motion } from 'framer-motion';
import { Laugh, Briefcase, Drama } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  selectedTone: string | null;
  onSelectTone: (tone: 'funny' | 'believable' | 'dramatic') => void;
}

const tones = [
  {
    id: 'funny',
    title: 'Funny',
    arabicTitle: 'مضحك',
      description: 'أعذار مضحكة وكوميدية جداً',
    icon: Laugh,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'believable',
    title: 'Believable',
    arabicTitle: 'مقنع',
    description: 'أعذار واقعية ومحترمة',
    icon: Briefcase,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'dramatic',
    title: 'Dramatic',
    arabicTitle: 'درامي',
    description: 'أعذار درامية ومؤثرة',
    icon: Drama,
    gradient: 'from-purple-500 to-pink-500',
  },
];

export function ToneSelector({ selectedTone, onSelectTone }: ToneSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8 text-white"
      >
        اختار نوع العذر
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tones.map((tone, index) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;

          return (
            <motion.button
              key={tone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTone(tone.id as 'funny' | 'believable' | 'dramatic')}
              className={cn(
                'relative p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border-2 transition-all duration-300',
                isSelected
                  ? 'border-pink-500 neon-glow'
                  : 'border-gray-700 hover:border-gray-600'
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={cn(
                    'p-4 rounded-full bg-gradient-to-br',
                    tone.gradient
                  )}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {tone.title}
                  </h3>
                  <p
                    className="text-lg text-gray-400 mb-2"
                  >
                    {tone.arabicTitle}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tone.description}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
