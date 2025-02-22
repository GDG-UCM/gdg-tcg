'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Game {
  gameNumber: number;
  name: string;
  imageUrl: string;
}

const GamePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams(); // Get card ID from route params

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (id) {
          // Fetch the games associated with this specific card
          const gamesRes = await fetch(`/api/cards/${id}`);
          const gamesData = await gamesRes.json();

          if (Array.isArray(gamesData)) {
            // Sort the games by gameNumber before setting them
            gamesData.sort((a: Game, b: Game) => a.gameNumber - b.gameNumber);
            setGames(gamesData); // Set the sorted data
          } else {
            console.error('Invalid response structure for games data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
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
        <p className="text-center">Loading games...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {games.map((game: Game) => (
            <div key={game.gameNumber} className="p-6 rounded-lg relative z-10">
              {/* Wrap the entire game in a link */}
              <Link href={`/augments/${game.gameNumber}/${id}`}>
                <div className="group relative">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-full h-fit object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 z-0"></div>
                  <div className="relative z-10">
                    <h2 className="text-center text-xl font-semibold text-white mt-4">{game.name}</h2>
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

export default GamePage;
