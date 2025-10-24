'use client';

import { motion } from 'framer-motion';
import { Trophy, Heart, TrendingUp, ChevronDown, ChevronUp, Laugh, Briefcase, Drama } from 'lucide-react';
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
          أقوى الأعذار
        </h2>
        <div className="text-center text-gray-400">جاري التحميل...</div>
      </div>
    );
  }

  if (excuses.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          أقوى الأعذار
        </h2>
        <div className="text-center text-gray-400">
          <p>مفيش أعذار لحد دلوقتي. خليك أول من يعتذر!</p>
        </div>
      </div>
    );
  }

  // ✅ This returns the proper icon for each tone
  const getToneBadgeIcon = (tone: string) => {
    switch (tone) {
      case 'funny':
        return <Laugh className="w-4 h-4" />;
      case 'believable':
        return <Briefcase className="w-4 h-4" />;
      case 'dramatic':
        return <Drama className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
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
        <h2 className="text-2xl md:text-3xl font-bold text-[#f6df55] flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-[#f6df55]" />
          أقوى الأعذار
        </h2>
        <p className="text-[#f6df5590]">
          عدد الأعذار الي إتعملت على الأبليكيشن:{' '}
          <span className="font-bold text-[#f6df55] bg-[#f6df5510] px-4 py-1 rounded-xl">
            {totalCount}
          </span>
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {excuses.map((excuse, index) => {
          const isExpanded = expandedExcuse === excuse.id;

          return (
            <motion.div
              key={excuse.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.div
                onClick={() =>
                  setExpandedExcuse(isExpanded ? null : excuse.id)
                }
                className="cursor-pointer group"
                layout
                initial={false}
                transition={{
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`bg-[#ffffff05] backdrop-blur-sm border-2 ${
                    isExpanded
                      ? 'border-[#f6df55]'
                      : 'border-[#f6df553d] group-hover:border-[#F6DF55]/50'
                  } transition-all overflow-hidden`}
                >
                  <CardHeader className="pb-3">
                    <motion.div
                      className="flex items-start justify-between"
                      layout="position"
                    >
                      <div className="flex items-center gap-2">
                        <motion.span
                          className="text-2xl font-bold text-[#f6df5590]"
                          layout="position"
                        >
                          #{index + 1}
                        </motion.span>
                        <motion.div layout="position">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 text-[#f6df5590] bg-[#f6df5510] border-2 border-[#f6df5590]"
                          >
                            {getToneBadgeIcon(excuse.tone)}
                            {excuse.tone}
                          </Badge>
                        </motion.div>
                      </div>
                      <motion.div
                        className="flex items-center gap-1 text-[#f6df55]"
                        layout="position"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="font-bold">
                          {excuse.likes_count}
                        </span>
                      </motion.div>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <motion.div
                      className="relative"
                      layout="position"
                      transition={{
                        layout: { duration: 0.3, ease: 'easeOut' },
                      }}
                    >
                      <motion.div
                        className="relative overflow-hidden"
                        animate={{
                          height: isExpanded ? 'auto' : '4.5rem',
                          transition: {
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                          },
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
                          className="absolute -inset-1 pointer-events-none"
                          animate={{
                            opacity: isExpanded ? 0 : 1,
                            background: isExpanded
                              ? 'linear-gradient(to bottom, transparent, transparent)'
                              : 'linear-gradient(to bottom, #12171350 30%, #121713 100%)',
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
                            rotate: isExpanded ? 180 : 0,
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            rotate: { duration: 0.3 },
                            scale: { duration: 0.2 },
                          }}
                          className="relative"
                        >
                          <ChevronDown className="w-5 h-5 text-[#f6df55]" />
                          <motion.div
                            className="absolute inset-0 bg-[#f6df55]/20 rounded-full blur-lg"
                            animate={{
                              opacity: isExpanded ? 0.5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.div>
                        <span className="text-sm font-medium pt-2 text-[#f6df55]">
                          {isExpanded ? 'عرض الأقل' : 'عرض المزيد'}
                        </span>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      layout="position"
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            duration: 0.3,
                            ease: 'easeOut',
                          }}
                          className="pt-4 border-t border-[#f6df553d]"
                        >
                          <ReactionBar
                            excuseId={excuse.id}
                            excuse={excuse.excuse_text}
                            onReaction={(type) => handleReaction(excuse.id, type)}
                            isExpanded
                          />
                        </motion.div>
                      )}

                      <div className="text-xs text-[#f6df5590] mt-3 flex justify-end">
                        {new Date(excuse.created_at).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-6 text-sm text-[#f6df55]">
        بتتحدث تلقائيًا كل 10 ثواني لعرض أحدث وأقوى الأعذار!
      </div>
    </div>
  );
}
