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
    title: 'مضحك',
    description: 'أعذار مضحكة وعبثية جداً',
    icon: Laugh,
  },
  {
    id: 'believable',
    title: 'واقعي',
    description: 'أعذار واقعية ومحترمة',
    icon: Briefcase,
  },
  {
    id: 'dramatic',
    title: 'مؤثر',
    description: 'أعذار درامية ومؤثرة',
    icon: Drama,
  },
];

export function ToneSelector({ selectedTone, onSelectTone }: ToneSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pt-0 md:pt-8 mt-0 md:mt-2">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-bold text-center mb-8 text-[#f6df55]"
      >
        اختار نوع العذر
      </motion.h2>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {tones.map((tone, index) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;

          return (
            <motion.button
              key={tone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1}}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTone(tone.id as 'funny' | 'believable' | 'dramatic')}
              className={cn(
                'relative p-4 md:p-6 rounded-xl bg-[#ffffff05] backdrop-blur-sm border-2 transition-all duration-300',
                isSelected
                  ? 'border-[#F6DF55] neon-glow'
                  : 'border-[#f6df553d] hover:border-[#f6df55]'
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={cn(
                    'p-3 rounded-full bg-[#f6df5510]'
                  )}
                >
                  <Icon className="w-6 h-6 text-[#f6df55]" />
                </div>

                <div>
                  <h3 className="text-sm md:text-md font-bold text-[#f6df55] mb-1">
                    {tone.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-[#f6df5590]">
                    {tone.description}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-2 md:right-3 w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="h-3 w-3 md:w-4 md:h-4 text-[#f6df55]"
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
