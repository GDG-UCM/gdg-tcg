'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Card {
  cardNumber: number;
  name: string;
  imageUrl: string;
}

const CardsPage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

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
              <Link href={`/cards/${card.cardNumber}`}>
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
      )}
    </motion.div>
  );
};

export default CardsPage;
