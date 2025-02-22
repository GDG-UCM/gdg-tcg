import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define interfaces
interface Augment {
  cardNumber: number;
  gameNumber: number;
  effect: string;
}

interface Card {
  cardNumber: number;
  name: string;
  imageUrl: string;
}

interface Game {
  gameNumber: number;
  name: string;
  imageUrl: string;
}

// Helper function to read a JSON file
function readJsonFile<T>(filePath: string): T | null {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData) as T;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

// Import the correct type from Next.js
import { RouteContext } from 'next/dist/server/app-render/types';

// GET request handler
export async function GET(
  req: NextRequest,
  context: RouteContext<{ game: string; card: string }>
): Promise<NextResponse> {
  try {
    // Extract game ID and card ID from params
    const { game, card } = context.params; // Do NOT use `await` here

    const gameNumber = parseInt(game);
    const cardNumber = parseInt(card);

    if (isNaN(gameNumber) || isNaN(cardNumber)) {
      return NextResponse.json({ error: 'Invalid game or card ID' }, { status: 400 });
    }

    // Define paths to JSON files
    const augmentsJsonPath = path.resolve('src/lib/data/augments.json');
    const cardsJsonPath = path.resolve('src/lib/data/cards.json');
    const gamesJsonPath = path.resolve('src/lib/data/games.json');

    // Read JSON data with proper types
    const augments = readJsonFile<Augment[]>(augmentsJsonPath);
    const cards = readJsonFile<Card[]>(cardsJsonPath);
    const games = readJsonFile<Game[]>(gamesJsonPath);

    if (!augments || !cards || !games) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Find the matching augment
    const matchingAugments = augments.filter(
      (augment) => augment.cardNumber === cardNumber && augment.gameNumber === gameNumber
    );

    // Fetch card details
    const cardDetails = cards.find((c) => c.cardNumber === cardNumber) || null;

    // Fetch game details
    const gameDetails = games.find((g) => g.gameNumber === gameNumber) || null;

    return NextResponse.json({
      augments: matchingAugments,
      card: cardDetails,
      game: gameDetails
    });
  } catch (error) {
    console.error('Error fetching augment details:', error);
    return NextResponse.json({ error: 'Failed to fetch augment details' }, { status: 500 });
  }
}
