import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the Augment interface with string properties
interface Augment {
  description: string;
  cardImageUrl: string;
  gameImageUrl: string;
  cardName: string;
  gameName: string;
}

// Utility function to read and parse the JSON data, return Augment array
function readJsonFile(filePath: string): Augment[] | null {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData) as Augment[]; // Specify that we expect an array of Augment objects
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

// Fetch augment data from JSON, ensure it returns Augment type or null
function getAugmentForGameAndCard(game: string, card: string): Augment | null {
  // Define the path to the JSON file
  const jsonFilePath = path.resolve('src/lib/data/augments.json');

  const augments = readJsonFile(jsonFilePath);
  if (!augments) return null;

  // Find the matching augment for the given game and card
  const augment = augments.find(
    (augment) => augment.gameName.toLowerCase() === game.toLowerCase() && augment.cardName.toLowerCase() === card.toLowerCase()
  );

  return augment || null;
}

// Update the handler to work with JSON data
export async function GET(req: NextRequest, { params }: { params: Promise<{ game: string; card: string }> }) {
  try {
    // Await the params object as it is a Promise
    const { game, card } = await params;

    // Fetch augment from the JSON file
    const augment = getAugmentForGameAndCard(game, card);

    // If augment is null or undefined, return a 404 error
    if (!augment) {
      return NextResponse.json({ error: 'Augment not found' }, { status: 404 });
    }

    return NextResponse.json({
      description: augment.description,
      cardImageUrl: augment.cardImageUrl,
      gameImageUrl: augment.gameImageUrl,
      cardName: augment.cardName,
      gameName: augment.gameName,
    });
  } catch (error) {
    console.error('Error fetching augment:', error);
    return NextResponse.json({ error: 'Failed to fetch augment' }, { status: 500 });
  }
}
