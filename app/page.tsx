'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { ToneSelector } from '@/components/ToneSelector';
import { GenerateButton } from '@/components/GenerateButton';
import { ExcuseCard } from '@/components/ExcuseCard';
import { Leaderboard } from '@/components/Leaderboard';
import { Footer } from '@/components/Footer';
import { incrementExcuseCount, saveInteraction } from '@/lib/supabase';

interface GeneratedExcuse {
  excuse: string;
  tips: string;
  excuseId: string;
}

export default function Home() {
  const [selectedTone, setSelectedTone] = useState<'funny' | 'believable' | 'dramatic' | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedExcuse, setGeneratedExcuse] = useState<GeneratedExcuse | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem('generationCount') || '0');
    setGenerationCount(count);
  }, []);

  const handleGenerate = async () => {
    if (!selectedTone) {
      toast.error('Please select a tone first!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generateExcuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tone: selectedTone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate excuse');
      }

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        if (data.excuse && data.tips) {
          setGeneratedExcuse({
            excuse: data.excuse,
            tips: data.tips,
            excuseId: 'demo',
          });
        }
        return;
      }

      setGeneratedExcuse({
        excuse: data.excuse,
        tips: data.tips,
        excuseId: data.excuseId,
      });

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
      });

      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      localStorage.setItem('generationCount', newCount.toString());

      if (newCount === 5) {
        setTimeout(() => {
          toast.info('Wow, 5 excuses already? You might need a real break!', {
            duration: 5000,
          });
        }, 1000);
      } else if (newCount === 10) {
        setTimeout(() => {
          toast.info('10 excuses?! Time to get back to work... or generate another one!', {
            duration: 5000,
          });
        }, 1000);
      }

      toast.success('Excuse generated!');
    } catch (error) {
      console.error('Error generating excuse:', error);
      toast.error('Failed to generate excuse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: 'like' | 'share' | 'copy') => {
    if (!generatedExcuse || generatedExcuse.excuseId === 'demo') return;

    try {
      await incrementExcuseCount(
        generatedExcuse.excuseId,
        type === 'like' ? 'likes_count' : type === 'share' ? 'shares_count' : 'copies_count'
      );

      await saveInteraction({
        excuse_id: generatedExcuse.excuseId,
        interaction_type: type,
        user_id: undefined,
      });
    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto">
        <Header />

        <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />

        <GenerateButton
          onClick={handleGenerate}
          disabled={!selectedTone || loading}
          loading={loading}
        />

        {generatedExcuse && (
          <ExcuseCard
            excuse={generatedExcuse.excuse}
            tips={generatedExcuse.tips}
            excuseId={generatedExcuse.excuseId}
            onReaction={handleReaction}
          />
        )}

        <div className="my-16">
          <Leaderboard />
        </div>

        <Footer />
      </div>
    </main>
  );
}
