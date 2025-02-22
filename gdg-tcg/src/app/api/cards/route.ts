import { db } from '../../../lib/db';

export async function GET() {
  return new Promise<Response>((resolve) => {
    db.all('SELECT * FROM cards', [], (err, rows) => {
      if (err) {
        console.error('Error fetching cards:', err);
        return resolve(new Response(JSON.stringify({ error: 'Failed to fetch cards' }), { status: 500 }));
      }
      return resolve(new Response(JSON.stringify(rows), { status: 200 }));
    });
  });
}
