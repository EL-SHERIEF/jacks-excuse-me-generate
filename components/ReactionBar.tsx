'use client';

import { motion } from 'framer-motion';
import { Heart, Share2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ShareDialog } from './ShareDialog';

interface ReactionBarProps {
  excuseId: string;
  excuse: string;
  onReaction: (type: 'like' | 'share' | 'copy' | 'unlike') => void;
  isExpanded?: boolean;
}

export function ReactionBar({ excuseId, excuse, onReaction, isExpanded }: ReactionBarProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    const likedExcuses = JSON.parse(localStorage.getItem('likedExcuses') || '[]');
    setLiked(likedExcuses.includes(excuseId));
  }, [excuseId]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
    });
  };

  const handleLike = () => {
    if (!excuseId) return;

    const likedExcuses = JSON.parse(localStorage.getItem('likedExcuses') || '[]');
    
    if (liked) {
      // Unlike the excuse
      const updatedLikedExcuses = likedExcuses.filter((id: string) => id !== excuseId);
      localStorage.setItem('likedExcuses', JSON.stringify(updatedLikedExcuses));
      setLiked(false);
      onReaction('unlike');
      toast.success('Excuse unliked');
    } else {
      // Like the excuse
      likedExcuses.push(excuseId);
      localStorage.setItem('likedExcuses', JSON.stringify(likedExcuses));
      setLiked(true);
      onReaction('like');
      triggerConfetti();
      toast.success('تم تسجيل الإعجاب بالعذر!');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(excuse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      triggerConfetti();
      onReaction('copy');
      toast.success('تم نسخ العذر إلى الحافظة!');
    } catch (error) {
      toast.error('فشل نسخ العذر');
    }
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
    triggerConfetti();
    onReaction('share');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            liked
              ? 'bg-pink-500/30 text-pink-400 border-2 border-pink-500 hover:bg-pink-500/20'
              : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-pink-500 hover:text-pink-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? 'Liked' : 'Like'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all"
        >
          {copied ? (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>تم النسخ!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              <span>نسخ</span>
            </div>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-purple-500 hover:text-purple-400 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>شارك</span>
        </motion.button>
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        excuse={excuse}
      />
    </div>
  );
}
