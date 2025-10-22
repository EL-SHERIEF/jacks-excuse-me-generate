'use client';

import { motion } from 'framer-motion';
import { Trophy, Heart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTopExcuses, type Excuse } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

export function Leaderboard() {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExcuses = async () => {
    const topExcuses = await getTopExcuses(10);
    setExcuses(topExcuses);
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2"
      >
        <Trophy className="w-8 h-8 text-yellow-500" />
        Top Excuses
        <TrendingUp className="w-6 h-6 text-green-500" />
      </motion.h2>

      <div className="grid gap-4 md:grid-cols-2">
        {excuses.map((excuse, index) => (
          <motion.div
            key={excuse.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700 hover:border-pink-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-500">
                  #{index + 1}
                </span>
                <Badge
                  variant="outline"
                  className={`${getToneBadgeColor(excuse.tone)} border`}
                >
                  {excuse.tone}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-pink-400">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-bold">{excuse.likes_count}</span>
              </div>
            </div>

            <p
              className="text-base text-gray-300 line-clamp-2 leading-relaxed"
              style={{
                direction: 'rtl',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {excuse.excuse_text}
            </p>

            <div className="mt-3 text-xs text-gray-500">
              {new Date(excuse.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        Updates automatically every 10 seconds
      </div>
    </div>
  );
}
