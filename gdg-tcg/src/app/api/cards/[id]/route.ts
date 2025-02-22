import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define interfaces for augment and game
interface Augment {
  cardNumber: number;
  gameNumber: number;
}

interface Game {
  gameNumber: number;
  name: string;
  imageUrl: string;
}

function readJsonFile(filePath: string): T | null {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // `context.params` is now typed as `{ id: string }`

    // Define paths to the augments and games JSON files
    const augmentsJsonPath = path.resolve('src/lib/data/augments.json');
    const gamesJsonPath = path.resolve('src/lib/data/games.json');

    // Read the augments and games data
    const augments = readJsonFile(augmentsJsonPath);
    const games = readJsonFile(gamesJsonPath);

    if (!augments || !games) {
      return NextResponse.json({ error: 'Failed to fetch augments or games' }, { status: 500 });
    }

    // Find all augments associated with the card number
    const cardAugments = augments.filter((augment: Augment) => augment.cardNumber === parseInt(id));
    const gameNumbers = cardAugments.map((augment: Augment) => augment.gameNumber);

    // Fetch the game details based on game numbers
    const associatedGames = gameNumbers.map((gameNumber: number) => {
      const game = games.find((game: Game) => game.gameNumber === gameNumber);
      return game || null;  // Return game details or null if not found
    }).filter(game => game !== null); // Remove any null values (games not found)

    // Return the associated game details wrapped in a Promise
    return Promise.resolve(NextResponse.json(associatedGames)); // Ensure async returns a promise
  } catch (error) {
    console.error('Error fetching augments or games:', error);
    return NextResponse.json({ error: 'Failed to fetch augments or games' }, { status: 500 });
  }
}
