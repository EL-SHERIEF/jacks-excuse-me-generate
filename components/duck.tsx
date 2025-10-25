'use client';

import { motion } from 'framer-motion';
import {
  Bookmark, Shield, Brain, Laugh, Award, EyeOff
} from 'lucide-react';
import Image from 'next/image';

export function Duck() {
  return (
 <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mt-8 mb-8 w-full max-w-md mx-auto"
    >
  <div className="mx-auto relative flex justify-center items-center">
          <Image className='md:max-w-lg max-w-[200px]' src="/ducky.webp" alt="Description" layout="responsive" width={500} height={475} />
            <div
  className="absolute bottom-0 md:w-[50vw] w-[80vw] md:h-[50vh] h-[30vh] md:-left-[10vw] left-0 pointer-events-none opacity-50"
  style={{
    background:"radial-gradient(ellipse at center, #f6df5570 0%, #f6df5500 60%)"  }}
/>
  </div>
      </motion.div>
  );
}
