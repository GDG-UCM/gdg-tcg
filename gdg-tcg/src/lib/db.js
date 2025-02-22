"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.getGameById = exports.getCardsForGame = exports.getGamesForCard = exports.getAugmentForGameAndCard = exports.getCardById = void 0;
var sqlite3 = require("sqlite3");
var path = require("path");
var fs = require("fs");
// Force the correct database location
var dbPath = path.resolve(process.cwd(), 'src/lib/data/db.sqlite');
// Ensure directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    console.log('Created directory for database:', path.dirname(dbPath));
}
// Open the SQLite database
var db = new sqlite3.Database(dbPath, function (err) {
    if (err) {
        console.error('Failed to open the database:', err.message);
    }
    else {
        console.log('Connected to the SQLite database at', dbPath);
    }
});
exports.db = db;
// Create tables if they don't exist
var createTables = function () {
    // Cards table: includes card number, name, description
    db.run("CREATE TABLE IF NOT EXISTS cards (\n      cardNumber INTEGER PRIMARY KEY,\n      name TEXT,\n      description TEXT,\n      imageUrl TEXT\n    );", function (err) {
        if (err)
            console.error('Error creating cards table:', err.message);
        else
            console.log('Cards table created or exists already.');
    });
    // Games table: includes game number, name, description
    db.run("CREATE TABLE IF NOT EXISTS games (\n      gameNumber INTEGER PRIMARY KEY,\n      name TEXT,\n      description TEXT,\n      imageUrl TEXT\n    );", function (err) {
        if (err)
            console.error('Error creating games table:', err.message);
        else
            console.log('Games table created or exists already.');
    });
    // Augments table: stores each augment, references both card and game
    db.run("CREATE TABLE IF NOT EXISTS augments (\n      augmentId INTEGER PRIMARY KEY AUTOINCREMENT,\n      cardNumber INTEGER,\n      gameNumber INTEGER,\n      augmentDescription TEXT,\n      FOREIGN KEY(cardNumber) REFERENCES cards(cardNumber),\n      FOREIGN KEY(gameNumber) REFERENCES games(gameNumber)\n    );", function (err) {
        if (err)
            console.error('Error creating augments table:', err.message);
        else
            console.log('Augments table created or exists already.');
    });
};
// Create tables
createTables();
// Add a function to get card by ID
var getCardById = function (id) {
    return new Promise(function (resolve, reject) {
        db.get("SELECT * FROM cards WHERE cardNumber = ?", [id], function (err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.getCardById = getCardById;
// Get a single augment for a specific game and card
var getAugmentForGameAndCard = function (gameId, cardId) {
    return new Promise(function (resolve, reject) {
        db.get("SELECT \n        a.augmentDescription AS description, \n        a.augmentId AS id,\n        c.imageUrl AS cardImageUrl, \n        c.name AS cardName, \n        g.imageUrl AS gameImageUrl, \n        g.name AS gameName\n      FROM augments a\n      JOIN cards c ON a.cardNumber = c.cardNumber\n      JOIN games g ON a.gameNumber = g.gameNumber\n      WHERE a.gameNumber = ? AND a.cardNumber = ?\n      LIMIT 1;", // Ensures only one augment is returned
        [gameId, cardId], function (err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.getAugmentForGameAndCard = getAugmentForGameAndCard;
// Add a function to get games by card ID
var getGamesForCard = function (cardId) {
    return new Promise(function (resolve, reject) {
        db.all("SELECT DISTINCT g.* FROM games g\n       INNER JOIN augments a ON g.gameNumber = a.gameNumber\n       WHERE a.cardNumber = ?", [cardId], function (err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.getGamesForCard = getGamesForCard;
// Add a function to get cards by game ID
var getCardsForGame = function (gameId) {
    return new Promise(function (resolve, reject) {
        db.all("SELECT DISTINCT c.* FROM cards c\n       INNER JOIN augments a ON c.cardNumber = a.cardNumber\n       WHERE a.gameNumber = ?", [gameId], function (err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.getCardsForGame = getCardsForGame;
// Add a function to get a game by ID
var getGameById = function (id) {
    return new Promise(function (resolve, reject) {
        db.get("SELECT * FROM games WHERE gameNumber = ?", [id], function (err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.getGameById = getGameById;
