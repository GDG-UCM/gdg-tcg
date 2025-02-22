import { NextResponse, NextRequest } from 'next/server';
import { getAugmentForGameAndCard } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { game: string; card: string } }) {
  try {
    const { game, card } = params;

    const augment = await getAugmentForGameAndCard(game, card);
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
