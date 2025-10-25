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
      toast.success('تم الغاء تسجيل الإعجاب!');
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
      <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            liked
              ? 'bg-[#f6df55]/30 text-[#f6df55] border-2 border-[#F6DF55] hover:bg-[#f6df55]/20'
              : 'text-[#f6df5590] bg-[#f6df5510] border-2 border-[#f6df5590] hover:border-[#f6df55] hover:text-[#f6df55] transition-all'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? 'تم الإعجاب' : 'أعجبني'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="text-sm flex items-center gap-2 px-4 py-2 rounded-full font-medium text-[#f6df5590] bg-[#f6df5510] border-2 border-[#f6df5590] hover:border-[#f6df55] hover:text-[#f6df55] transition-all"
        >
          {copied ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>تم النسخ!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              <span>نسخ</span>
            </div>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="text-sm flex items-center gap-2 px-4 py-2 rounded-full font-medium text-[#f6df5590] bg-[#f6df5510] border-2 border-[#f6df5590] hover:border-[#f6df55] hover:text-[#f6df55] transition-all"
        >
          <Share2 className="w-4 h-4" />
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
