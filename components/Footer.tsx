'use client';

import { motion } from 'framer-motion';
import { Heart, Code, Shield } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="w-full max-w-5xl mx-auto px-4 py-12 mt-16"
    >
      <div className="border-t border-gray-800 pt-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Code className="w-4 h-4" />
            <span className="text-sm">
              تم التطوير باستخدام Next.js و Google Gemini و Supabase و Framer Motion
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Heart className="w-4 h-4 text-pink-500 fill-current" />
            <span className="text-sm">
              تم التصميم للفريلانسرز اللي محتاجين بريك إبداعي
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Shield className="w-4 h-4" />
            <span className="text-xs">
              للترفيه والتعليم فقط
            </span>
          </div>

          <div className="text-xs text-gray-600 max-w-2xl mx-auto">
            هذا التطبيق يقوم بتوليد أعذار خيالية باستخدام الذكاء الاصطناعي. كل المحتوى للفكاهة
            وتعلم أنماط التواصل. يرجى دائماً التحلي بالصدق والمهنية في المواقف الحقيقية. لا تستخدم
            هذه الأعذار لخداع الآخرين.
          </div>

          <div className="text-xs text-gray-700">
            مدعوم بتقنية Google Gemini © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
