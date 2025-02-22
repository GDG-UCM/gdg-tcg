import sqlite3 from 'sqlite3';  // Default import for sqlite3
import path from 'path';         // Correct ES module import for path
import fs from 'fs';             // Correct ES module import for fs

// Force the correct database location
const dbPath = path.resolve(process.cwd(), 'src/lib/data/db.sqlite');

// Ensure directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  console.log('Created directory for database:', path.dirname(dbPath));
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
  // Cards table: includes card number, name, description
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

  // Games table: includes game number, name, description
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

  // Augments table: stores each augment, references both card and game
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

// Create tables
createTables();

// Add a function to get card by ID
export const getCardById = (id: string) => {
  return new Promise<any>((resolve, reject) => {
    db.get(
      `SELECT * FROM cards WHERE cardNumber = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// Get a single augment for a specific game and card
export const getAugmentForGameAndCard = (gameId: string, cardId: string) => {
  return new Promise<any>((resolve, reject) => {
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
      LIMIT 1;`, // Ensures only one augment is returned
      [gameId, cardId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

// Add a function to get games by card ID
export const getGamesForCard = (cardId: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(
      `SELECT DISTINCT g.* FROM games g
       INNER JOIN augments a ON g.gameNumber = a.gameNumber
       WHERE a.cardNumber = ?`,
      [cardId],
      (err, rows) => {
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
export const getCardsForGame = (gameId: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(
      `SELECT DISTINCT c.* FROM cards c
       INNER JOIN augments a ON c.cardNumber = a.cardNumber
       WHERE a.gameNumber = ?`,
      [gameId],
      (err, rows) => {
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
export const getGameById = (id: string) => {
  return new Promise<any>((resolve, reject) => {
    db.get(
      `SELECT * FROM games WHERE gameNumber = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

export { db };
