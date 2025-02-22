import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the Game interface
interface Game {
  gameNumber: number;
  name: string;
  description: string;
  imageUrl: string;
  cardNumbers: number[];  // Assuming each game has a list of associated card numbers
}

// Define the Card interface
interface Card {
  cardNumber: number;
  name: string;
  description: string;
  imageUrl: string;
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

// Update this function to fetch games data from JSON
function getGamesForCard(id: string): Game[] {
  // Define the path to the cards and games JSON file
  const cardsJsonPath = path.resolve('src/lib/data/cards.json');
  const gamesJsonPath = path.resolve('src/lib/data/games.json');

  const cards = readJsonFile<Card[]>(cardsJsonPath);
  const games = readJsonFile<Game[]>(gamesJsonPath);
  if (!cards || !games) return [];

  // Find the card with the given id
  const card = cards.find((card) => card.cardNumber === parseInt(id));
  if (!card) return [];

  // Return games associated with the card
  return games.filter((game) => game.cardNumbers.includes(parseInt(id)));
}

// Use an async function to handle the route
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
    const { id } = await params;

    // Fetch the games associated with the card from the JSON data
    const games = getGamesForCard(id);
    
    // If no games are found, return an empty array or a 404 error
    if (!games.length) {
      return NextResponse.json({ error: 'No games found for this card' }, { status: 404 });
    }

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games for card:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
