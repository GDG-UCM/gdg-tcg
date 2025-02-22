'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Augment {
  augmentDescription: string;
  cardName: string;
  cardImageUrl: string;
  gameName: string;
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
          } else if (data.augments.length > 0) {
            // Extract data from API response
            setAugment({
              augmentDescription: data.augments[0].augmentDescription,
              cardName: data.card.name,
              cardImageUrl: data.card.imageUrl,
              gameName: data.game.name,
              gameImageUrl: data.game.imageUrl,
            });
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
        {/* Card Image */}
        <div className="w-64">
          <Image
            width={400}
            height={400}
            src={augment.cardImageUrl}
            alt={augment.cardName}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <h2 className="text-xl font-semibold mt-2">{augment.cardName}</h2>
        </div>

        {/* Augment Description */}
        <p className="max-w-lg text-lg italic">{augment.augmentDescription}</p>

        {/* Game Image */}
        <div className="w-64">
          <Image
            width={400}
            height={400}
            src={augment.gameImageUrl}
            alt={augment.gameName}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <h2 className="text-xl font-semibold mt-2">{augment.gameName}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default AugmentPage;
