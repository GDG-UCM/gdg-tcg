import { NextResponse } from 'next/server';
import { getGamesForCard } from '@/lib/db';

// Use an async function to handle the route
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
    const { id } = await params;

    // Fetch the games associated with the card
    const games = await getGamesForCard(id);
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games for card:', error);
    return NextResponse.json({ error: 'Failed to fetch data' });
  }
}
