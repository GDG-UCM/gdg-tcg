import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define interfaces for augment and card
interface Augment {
  cardNumber: number;
  gameNumber: number;
}

interface Card {
  cardNumber: number;
  name: string;
  description: string;
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;  // Get the game ID

    // Define paths to the cards, augments, and games JSON files
    const cardsJsonPath = path.resolve('src/lib/data/cards.json');
    const augmentsJsonPath = path.resolve('src/lib/data/augments.json');

    // Read the cards and augments data
    const cards = readJsonFile(cardsJsonPath);
    const augments = readJsonFile(augmentsJsonPath);

    if (!cards || !augments) {
      return NextResponse.json({ error: 'Failed to fetch cards or augments' }, { status: 500 });
    }

    // Find all augments associated with the game number
    const gameAugments = augments.filter((augment: Augment) => augment.gameNumber === parseInt(id));
    const cardNumbers = gameAugments.map((augment: Augment) => augment.cardNumber);

    // Fetch the card details based on card numbers
    const associatedCards = cardNumbers.map((cardNumber: number) => {
      const card = cards.find((card: Card) => card.cardNumber === cardNumber);
      return card || null;  // Return card details or null if not found
    }).filter(card => card !== null); // Remove any null values (cards not found)

    // Return the associated card details
    return NextResponse.json(associatedCards);
  } catch (error) {
    console.error('Error fetching cards or augments:', error);
    return NextResponse.json({ error: 'Failed to fetch cards or augments' }, { status: 500 });
  }
}
