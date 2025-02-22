import { NextResponse } from 'next/server';
import { getCardsForGame } from '@/lib/db';

// Use an async function to handle the route
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
    const { id } = await params;

    // Fetch the cards associated with the game
    const cards = await getCardsForGame(id);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards for game:', error);
    return NextResponse.json({ error: 'Failed to fetch data' });
  }
}
