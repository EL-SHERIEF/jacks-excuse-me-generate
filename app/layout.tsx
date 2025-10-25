import './globals.css';
import type { Metadata } from 'next';
import { Almarai } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import localFont from 'next/font/local';

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
});

const headingFont = localFont({
  src: './fonts/PixelAE-Bold.ttf',
  variable: '--font-heading',
  display: 'swap', // keeps fast rendering with fallback
});

export const metadata: Metadata = {
  title: 'مولد الأعذار - أعذار فريلانسر مصري بالذكاء الاصطناعي',
  description:
    'مولد أعذار باللهجة المصرية للفريلانسرز. اختار بين الأعذار المضحكة، المقنعة، أو الدرامية. مدعوم بتقنية جوجل جيميناي للذكاء الاصطناعي.',
  keywords: [
    'مولد الأعذار',
    'أعذار مصرية',
    'فريلانسر',
    'ذكاء اصطناعي',
    'جيميناي',
    'مضحك',
    'أعذار العمل',
    'فري لانس مصر',
  ],
  authors: [{ name: 'مولد الأعذار' }],
  openGraph: {
    title: 'Excuse Generator - AI-Powered Egyptian Freelancer Excuses',
    description:
      'Generate hilarious and creative Egyptian Arabic excuses with Google Gemini',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excuse Generator - AI-Powered Egyptian Freelancer Excuses',
    description:
      'Generate hilarious and creative Egyptian Arabic excuses with Google Gemini',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${headingFont.variable}`}>
      <body className={almarai.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
