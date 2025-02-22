'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import '@/app/globals.css';

export default function BackgroundAnimation() {
    const [showFirst, setShowFirst] = useState(true);
    const [showSecond, setShowSecond] = useState(false);

    useEffect(() => {
        // Show first image for 2 seconds
        const timer1 = setTimeout(() => setShowFirst(false), 2000);

        // Fade in second image after the first fades out
        const timer2 = setTimeout(() => setShowSecond(true), 2000);

        // Clean up timeouts
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence>
                {/* First image */}
                {showFirst && (
                    <motion.div
                        key="first-image"
                        className="absolute w-full h-full"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                          src="/background_0.png"
                          alt="Second Image"
                          layout="fill"
                          objectFit="cover"
                          quality={100}  // Ensure high quality
                          sizes="100vw"  // Make sure it scales appropriately for the viewport
                        />
                    </motion.div>
                )}

                {/* Second image - fade in */}
                {showSecond && (
                    <motion.div
                        key="second-image"
                        className="absolute w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                          src="/background_1.png"
                          alt="Second Image"
                          layout="fill"
                          objectFit="cover"
                          quality={100}  // Ensure high quality
                          sizes="100vw"  // Make sure it scales appropriately for the viewport
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
