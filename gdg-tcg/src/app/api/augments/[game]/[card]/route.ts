import { NextRequest, NextResponse } from 'next/server';
import { getAugmentForGameAndCard } from '@/lib/db';

// Define the Augment interface with string properties
interface Augment {
  description: string;
  cardImageUrl: string;
  gameImageUrl: string;
  cardName: string;
  gameName: string;
}

// Update this to be a more specific type, removing `any`
function isAugment(augment: unknown): augment is Augment {
  // Check if augment is an object and if it has the required string properties
  return (
    typeof augment === 'object' &&
    augment !== null &&
    typeof (augment as Augment).description === 'string' &&
    typeof (augment as Augment).cardImageUrl === 'string' &&
    typeof (augment as Augment).gameImageUrl === 'string' &&
    typeof (augment as Augment).cardName === 'string' &&
    typeof (augment as Augment).gameName === 'string'
  );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ game: string; card: string }> }) {
  try {
    // Await the params object as it is a Promise
    const { game, card } = await params;

    const augment = await getAugmentForGameAndCard(game, card);

    // If augment is null or undefined, return a 404 error
    if (!augment) {
      return NextResponse.json({ error: 'Augment not found' }, { status: 404 });
    }

    // Check if augment is of the correct type
    if (!isAugment(augment)) {
      return NextResponse.json({ error: 'Invalid augment data' }, { status: 500 });
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
