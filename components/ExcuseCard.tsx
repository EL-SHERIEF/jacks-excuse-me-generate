'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ReactionBar } from './ReactionBar';

interface ExcuseCardProps {
  excuse: string;
  tips: string;
  excuseId: string;
  onReaction: (type: 'like' | 'share' | 'copy') => void;
}

export function ExcuseCard({ excuse, tips, excuseId, onReaction }: ExcuseCardProps) {
  const [tipsExpanded, setTipsExpanded] = useState(false);

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

        <div className="border-t border-gray-700 my-6"></div>

        <div>
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-lg">Excuse Tips (Fictional)</span>
            </div>
            {tipsExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          <motion.div
            initial={false}
            animate={{ height: tipsExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    This content is fictional and for training/analysis only.
                    Do not use to harm or deceive real people. Always communicate
                    honestly in professional settings.
                  </span>
                </p>
              </div>

              <div
                className="prose prose-invert prose-sm max-w-none text-gray-300 max-h-96 overflow-y-auto"
                style={{ lineHeight: '1.7' }}
              >
                {tips.split('\n\n').map((section, index) => {
                  if (section.startsWith('**') && section.includes('**')) {
                    const [heading, ...content] = section.split('\n');
                    const cleanHeading = heading.replace(/\*\*/g, '');
                    return (
                      <div key={index} className="mb-4">
                        <h4 className="text-pink-400 font-bold text-base mb-2">
                          {cleanHeading}
                        </h4>
                        <div className="text-gray-300 space-y-1">
                          {content.map((line, i) => (
                            <p key={i} className="text-sm leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="text-sm text-gray-300 mb-2 leading-relaxed">
                      {section}
                    </p>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
