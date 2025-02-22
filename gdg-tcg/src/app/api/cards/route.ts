import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

// Use an async function to handle the route
export async function GET() {
  try {
    // Define the path to the cards JSON file
    const cardsJsonPath = path.resolve('src/lib/data/cards.json');

    // Read the cards data from the JSON file
    const cards = readJsonFile<Card[]>(cardsJsonPath);

    if (!cards) {
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
