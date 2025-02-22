'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import '@/app/globals.css';

interface IntroAnimationProps {
    onFirstImageFadeIn?: () => void; // Make the callback optional
}

export default function IntroAnimation({ onFirstImageFadeIn }: IntroAnimationProps) {
    const [showFirst, setShowFirst] = useState(true);
    const [showSecond, setShowSecond] = useState(false);

    useEffect(() => {
        // Show first image for 2 seconds
        const timer1 = setTimeout(() => setShowFirst(false), 2000);

        // Fade in second image after the first fades out
        const timer2 = setTimeout(() => setShowSecond(true), 2000);

        // Trigger callback once the first image fades out, but check if the callback exists
        const timer3 = setTimeout(() => {
            if (onFirstImageFadeIn) {
                onFirstImageFadeIn(); // Trigger the callback if it exists
            }
        }, 2000);

        // Clean up timeouts
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onFirstImageFadeIn]);

    return (
        <div className="fixed inset-0 w-full h-full z-0">
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
                            alt="First Image"
                            className="object-cover w-full h-full"
                            width={1920}  // Set appropriate width
                            height={1080} // Set appropriate height
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
                            className="object-cover w-full h-full"
                            width={1920}  // Set appropriate width
                            height={1080} // Set appropriate height
                            quality={100}  // Ensure high quality
                            sizes="100vw"  // Make sure it scales appropriately for the viewport
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
