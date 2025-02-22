'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Augment {
  cardName: string;
  gameName: string;
  description: string;
  cardImageUrl: string;
  gameImageUrl: string;
}

const AugmentPage = () => {
  const [augment, setAugment] = useState<Augment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { game, card } = useParams(); // Get game and card ID from route params

  useEffect(() => {
    const fetchAugment = async () => {
      try {
        if (game && card) {
          const res = await fetch(`/api/augments/${game}/${card}`);
          const data = await res.json();

          if (data.error) {
            console.error(data.error);
          } else {
            setAugment(data);
          }
        }
      } catch (error) {
        console.error('Error fetching augment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAugment();
  }, [game, card]);

  if (loading) return <p>Loading...</p>;
  if (!augment) return <p>No augment found.</p>;

  return (
    <motion.div
      className="container mx-auto py-8 flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Augment Details</h1>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Card Image and Name */}
        <div className="w-64">
          <Image
            width={1200}
            height={800}
            src={augment.cardImageUrl}
            alt={augment.cardName}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <p className="mt-2 text-lg font-semibold">{augment.cardName}</p>
        </div>

        {/* Augment Description */}
        <p className="max-w-lg text-lg italic">{augment.description}</p>

        {/* Game Image and Name */}
        <div className="w-64">
          <Image
            width={1200}
            height={800}
            src={augment.gameImageUrl}
            alt={augment.gameName}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <p className="mt-2 text-lg font-semibold">{augment.gameName}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AugmentPage;
