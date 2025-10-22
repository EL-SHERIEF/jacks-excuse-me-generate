import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Excuse Generator - AI-Powered Egyptian Freelancer Excuses',
  description: 'Generate hilarious and creative Egyptian Arabic excuses with Google Gemini. Choose from funny, believable, or dramatic tones. For entertainment purposes only.',
  keywords: ['excuse generator', 'egyptian arabic', 'freelancer', 'AI', 'gemini', 'humor'],
  authors: [{ name: 'Excuse Generator' }],
  openGraph: {
    title: 'Excuse Generator - AI-Powered Egyptian Freelancer Excuses',
    description: 'Generate hilarious and creative Egyptian Arabic excuses with Google Gemini',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excuse Generator - AI-Powered Egyptian Freelancer Excuses',
    description: 'Generate hilarious and creative Egyptian Arabic excuses with Google Gemini',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
