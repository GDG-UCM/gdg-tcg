'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import IntroAnimation from '@/components/IntroAnimation'; // Adjust if path differs
import { useRouter } from 'next/navigation';

export default function Page() {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  // Callback function when the animation completes
  const handleFirstImageFadeIn = () => {
    setShowContent(true);
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* Intro Animation with lower z-index */}
      <div className="absolute inset-0 z-0">
        <IntroAnimation onFirstImageFadeIn={handleFirstImageFadeIn} />
      </div>

      {/* Main content appears after animation */}
      {showContent && (
        <motion.div
          className="relative z-10 flex flex-col items-center text-center text-white font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl mb-6">GDG TCG Augments</h1>
          <button
            onClick={() => router.push('/cards')}
            className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
          >
            Cards
          </button>
          <button
            onClick={() => router.push('/games')}
            className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition duration-300"
          >
            Games
          </button>
        </motion.div>
      )}
    </div>
  );
}
