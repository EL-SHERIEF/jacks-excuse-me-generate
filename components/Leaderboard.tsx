'use client';

import { motion } from 'framer-motion';
import { Trophy, Heart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTopExcuses, getTotalExcuseCount, incrementExcuseCount, saveInteraction, type Excuse } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { ReactionBar } from './ReactionBar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function Leaderboard() {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExcuse, setExpandedExcuse] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExcuses = async () => {
    const [topExcuses, count] = await Promise.all([
      getTopExcuses(10),
      getTotalExcuseCount()
    ]);
    setExcuses(topExcuses);
    setTotalCount(count);
    setLoading(false);
  };

  useEffect(() => {
    fetchExcuses();
    const interval = setInterval(fetchExcuses, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Top Excuses
        </h2>
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (excuses.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Top Excuses
        </h2>
        <div className="text-center text-gray-400">
          <p>No excuses yet. Be the first to generate one!</p>
        </div>
      </div>
    );
  }

  const getToneBadgeColor = (tone: string) => {
    switch (tone) {
      case 'funny':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'believable':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'dramatic':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleReaction = async (excuseId: string, type: 'like' | 'share' | 'copy' | 'unlike') => {
    try {
      if (type === 'unlike') {
        await incrementExcuseCount(excuseId, 'likes_count', false);
      } else {
        await incrementExcuseCount(
          excuseId,
          type === 'like' ? 'likes_count' : type === 'share' ? 'shares_count' : 'copies_count'
        );
      }

      await saveInteraction({
        excuse_id: excuseId,
        interaction_type: type === 'unlike' ? 'like' : type,
        user_id: undefined,
      });

      // Refresh excuses after interaction
      fetchExcuses();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4 mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Top Excuses
          <TrendingUp className="w-6 h-6 text-green-500" />
        </h2>
        <p className="text-gray-400">
          Total excuses generated: <span className="font-bold text-white">{totalCount}</span>
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {excuses.map((excuse, index) => (
          <motion.div
            key={excuse.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <motion.div
              onClick={() => setExpandedExcuse(expandedExcuse === excuse.id ? null : excuse.id)}
              className="cursor-pointer group"
              layout
              initial={false}
              transition={{ 
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700 group-hover:border-pink-500/50 transition-all overflow-hidden">
                <CardHeader className="pb-3">
                  <motion.div 
                    className="flex items-start justify-between"
                    layout="position"
                  >
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="text-2xl font-bold text-gray-500"
                        layout="position"
                      >
                        #{index + 1}
                      </motion.span>
                      <motion.div layout="position">
                        <Badge
                          variant="outline"
                          className={`${getToneBadgeColor(excuse.tone)} border`}
                        >
                          {excuse.tone}
                        </Badge>
                      </motion.div>
                    </div>
                    <motion.div 
                      className="flex items-center gap-1 text-pink-400"
                      layout="position"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="font-bold">{excuse.likes_count}</span>
                    </motion.div>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <motion.div 
                    className="relative"
                    layout="position"
                    transition={{
                      layout: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <motion.div 
                      className="relative overflow-hidden"
                      animate={{ 
                        height: expandedExcuse === excuse.id ? "auto" : "4.5rem",
                        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                      }}
                    >
                      <motion.p
                        className="text-base text-gray-300 leading-relaxed mb-2"
                        style={{
                          direction: 'rtl',
                          fontFamily: 'Arial, sans-serif',
                        }}
                        layout="position"
                      >
                        {excuse.excuse_text}
                      </motion.p>
                      
                      <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                          opacity: expandedExcuse === excuse.id ? 0 : 1,
                          background: expandedExcuse === excuse.id 
                            ? 'linear-gradient(to bottom, transparent, transparent)'
                            : 'linear-gradient(to bottom, transparent 30%, rgba(16, 17, 30, 0.5) 50%, rgb(16, 17, 30 ) 100%)'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-1.5 text-gray-400 mt-1 justify-center w-full group-hover:text-gray-300 transition-colors"
                      layout="position"
                    >
                      <motion.div
                        animate={{ 
                          rotate: expandedExcuse === excuse.id ? 180 : 0,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 0.3 },
                          scale: { duration: 0.2 }
                        }}
                        className="relative"
                      >
                        <ChevronDown className="w-5 h-5" />
                        <motion.div
                          className="absolute inset-0 bg-pink-500/20 rounded-full blur-lg"
                          animate={{ 
                            opacity: expandedExcuse === excuse.id ? 0.5 : 0
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                      <span className="text-sm font-medium pt-2">
                        {expandedExcuse === excuse.id ? 'Show less' : 'Read more'}
                      </span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    layout="position"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedExcuse === excuse.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ 
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className="pt-4 border-t border-gray-700"
                      >
                        <ReactionBar
                          excuseId={excuse.id}
                          excuse={excuse.excuse_text}
                          onReaction={(type) => handleReaction(excuse.id, type)}
                          isExpanded
                        />
                      </motion.div>
                    )}

                    <div className="text-xs text-gray-500 mt-3 flex justify-end">
                      {new Date(excuse.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        Updates automatically every 10 seconds
      </div>
    </div>
  );
}
