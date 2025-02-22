'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Card {
  cardNumber: number;
  name: string;
  description: string;
  imageUrl: string;
}

const GamesPage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch the cards list from the API
        const cardsRes = await fetch(`/api/games/${id}`);
        const cardsData = await cardsRes.json();

        if (!Array.isArray(cardsData)) {
          console.error('Invalid response structure for cards');
          return;
        }

        setCards(cardsData); // Set the fetched cards data
      } catch (error) {
        console.error('Error fetching card data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCardsData();
  }, []); // Fetch once on mount

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div
      className="container mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {cards.map((card: Card) => (
          <div key={card.cardNumber} className="p-6 rounded-lg relative z-10">
            {/* Wrap the entire card in a link */}
            <Link href={`/augments/${id}/${card.cardNumber}`}>
              <div className="group relative">
                <Image
                  width={1200}
                  height={800}
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-fit object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 z-0"></div>
                <div className="relative z-10">
                  <h2 className="text-center text-xl font-semibold text-white mt-4">{card.name}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GamesPage;
