'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Card {
  cardNumber: number;
  name: string;
  imageUrl: string;
}

const CardsPage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams(); // Get game ID from route params

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (id) {
          // Fetch the cards associated with this specific game
          const cardsRes = await fetch(`/api/games/${id}`);
          const cardsData = await cardsRes.json();

          if (Array.isArray(cardsData)) {
            // Sort the cards by cardNumber before setting them (if needed)
            cardsData.sort((a: Card, b: Card) => a.cardNumber - b.cardNumber);
            setCards(cardsData); // Set the sorted data
          } else {
            console.error('Invalid response structure for cards data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div
      className="container mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {loading ? (
        <p className="text-center">Loading cards...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {cards.map((card: Card) => (
            <div key={card.cardNumber} className="p-6 rounded-lg relative z-10">
              {/* Wrap the entire card in a link */}
              <Link href={`/augments/${id}/${card.cardNumber}`}>
                <div className="group relative">
                  <img
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
      )}
    </motion.div>
  );
};

export default CardsPage;
