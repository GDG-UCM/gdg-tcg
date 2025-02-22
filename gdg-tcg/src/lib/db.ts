import sqlite3 from 'sqlite3'; // Default import for sqlite3
import path from 'path'; // Correct ES module import for path
import fs from 'fs'; // Correct ES module import for fs

// Force the correct database location
const dbPath = path.resolve(process.cwd(), 'src/lib/data/db.sqlite');

// Ensure directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  console.log('Created directory for database:', path.dirname(dbPath));
}

// Define types for database rows
interface Card {
  cardNumber: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Game {
  gameNumber: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Augment {
  augmentId: number;
  cardNumber: number;
  gameNumber: number;
  augmentDescription: string;
}

// Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open the database:', err.message);
  } else {
    console.log('Connected to the SQLite database at', dbPath);
  }
});

// Create tables if they don't exist
const createTables = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS cards (
      cardNumber INTEGER PRIMARY KEY,
      name TEXT,
      description TEXT,
      imageUrl TEXT
    );`,
    (err) => {
      if (err) console.error('Error creating cards table:', err.message);
      else console.log('Cards table created or exists already.');
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS games (
      gameNumber INTEGER PRIMARY KEY,
      name TEXT,
      description TEXT,
      imageUrl TEXT
    );`,
    (err) => {
      if (err) console.error('Error creating games table:', err.message);
      else console.log('Games table created or exists already.');
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS augments (
      augmentId INTEGER PRIMARY KEY AUTOINCREMENT,
      cardNumber INTEGER,
      gameNumber INTEGER,
      augmentDescription TEXT,
      FOREIGN KEY(cardNumber) REFERENCES cards(cardNumber),
      FOREIGN KEY(gameNumber) REFERENCES games(gameNumber)
    );`,
    (err) => {
      if (err) console.error('Error creating augments table:', err.message);
      else console.log('Augments table created or exists already.');
    }
  );
};

createTables();

// Add a function to get card by ID
export const getCardById = (id: string): Promise<Card | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM cards WHERE cardNumber = ?`,
      [id],
      (err, row: Card | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null); // Return null if no row found
        }
      }
    );
  });
};

// Get a single augment for a specific game and card
export const getAugmentForGameAndCard = (gameId: string, cardId: string): Promise<Augment | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        a.augmentDescription AS description, 
        a.augmentId AS id,
        c.imageUrl AS cardImageUrl, 
        c.name AS cardName, 
        g.imageUrl AS gameImageUrl, 
        g.name AS gameName
      FROM augments a
      JOIN cards c ON a.cardNumber = c.cardNumber
      JOIN games g ON a.gameNumber = g.gameNumber
      WHERE a.gameNumber = ? AND a.cardNumber = ?
      LIMIT 1;`,
      [gameId, cardId],
      (err, row: Augment | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null); // Return null if no augment found
        }
      }
    );
  });
};

// Add a function to get games by card ID
export const getGamesForCard = (cardId: string): Promise<Game[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT g.* FROM games g
       INNER JOIN augments a ON g.gameNumber = a.gameNumber
       WHERE a.cardNumber = ?`,
      [cardId],
      (err, rows: Game[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// Add a function to get cards by game ID
export const getCardsForGame = (gameId: string): Promise<Card[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT c.* FROM cards c
       INNER JOIN augments a ON c.cardNumber = a.cardNumber
       WHERE a.gameNumber = ?`,
      [gameId],
      (err, rows: Card[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// Add a function to get a game by ID
export const getGameById = (id: string): Promise<Game | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM games WHERE gameNumber = ?`,
      [id],
      (err, row: Game | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null); // Return null if no row found
        }
      }
    );
  });
};

export { db };
