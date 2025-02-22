import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the Game interface
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
    return JSON.parse(jsonData) as T; // Return typed data
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

// Use an async function to handle the route
export async function GET() {
  try {
    // Define the path to the games JSON file
    const gamesJsonPath = path.resolve('src/lib/data/games.json');

    // Read the games data from the JSON file
    const games = readJsonFile<Game[]>(gamesJsonPath);

    if (!games) {
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
