import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the Card and Game interfaces
interface Card {
  cardNumber: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Game {
  gameNumber: number;
  name: string;
  description: string;
  imageUrl: string;
  cardNumbers: number[]; // Assuming this holds related card numbers
}

// Utility function to read and parse the JSON data
function readJsonFile<T>(filePath: string): T | null {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData) as T;  // Return typed data
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

// Update this function to fetch cards data from JSON
function getCardsForGame(id: string): Card[] {
  // Define the path to the cards and games JSON files
  const cardsJsonPath = path.resolve('src/lib/data/cards.json');
  const gamesJsonPath = path.resolve('src/lib/data/games.json');

  const cards = readJsonFile<Card[]>(cardsJsonPath);
  const games = readJsonFile<Game[]>(gamesJsonPath);
  if (!cards || !games) return [];

  // Find the game with the given id
  const game = games.find((game) => game.gameNumber === parseInt(id));
  if (!game) return [];

  // Return cards associated with the game
  return cards.filter((card) => game.cardNumbers.includes(card.cardNumber));
}

// Use an async function to handle the route
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
    const { id } = await params;

    // Fetch the cards associated with the game from the JSON data
    const cards = getCardsForGame(id);
    
    // If no cards are found, return an empty array or a 404 error
    if (!cards.length) {
      return NextResponse.json({ error: 'No cards found for this game' }, { status: 404 });
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards for game:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
