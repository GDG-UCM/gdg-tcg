import { db } from './db';

// Insert default data into 'cards', 'augments', and 'games' tables
const insertDefaultData = () => {
  // Insert 18 cards with images
  const insertCard = `INSERT INTO cards (cardNumber, name, description, imageUrl) VALUES (?, ?, ?, ?)`;
  const cards = [
    ['Rufus', 'Lorem ipsum dolor sit amet.', '/cards/1.png'],
    ['Google-Chan', 'Lorem ipsum dolor sit amet.', '/cards/2.png'],
    ['Let\'s Go Gambling', 'Lorem ipsum dolor sit amet.', '/cards/3.png'],
    ['We Bear Bares', 'Lorem ipsum dolor sit amet.', '/cards/4.png'],
    ['Electric Yellow Rat Bastard', 'Lorem ipsum dolor sit amet.', '/cards/5.png'],
    ['Amog Us', 'Lorem ipsum dolor sit amet.', '/cards/6.png'],
    ['Popcar', 'Lorem ipsum dolor sit amet.', '/cards/7.png'],
    ['Unlike Unto Us', 'Lorem ipsum dolor sit amet.', '/cards/8.png'],
    ['Eff the Ground Shork', 'Lorem ipsum dolor sit amet.', '/cards/9.png'],
    ['Undertail', 'Lorem ipsum dolor sit amet.', '/cards/10.png'],
    ['Sussyphus, Founder of Ephyra', 'Lorem ipsum dolor sit amet.', '/cards/11.png'],
    ['Copium Panda, Fall of the West', 'Lorem ipsum dolor sit amet.', '/cards/12.png'],
    ['Spongeman the King of Curses', 'Lorem ipsum dolor sit amet.', '/cards/13.png'],
    ['P Squiddy the Dishonored One', 'Lorem ipsum dolor sit amet.', '/cards/14.png'],
    ['Neuron Decay Device', 'Lorem ipsum dolor sit amet.', '/cards/15.png'],
    ['Gemini the Omniscient', 'Lorem ipsum dolor sit amet.', '/cards/16.png'],
    ['Zhong Xi Na, Yu Can\'t Xi Mi', 'Lorem ipsum dolor sit amet.', '/cards/17.png'],
    ['Earthsplitter the Grabbitational One', 'Lorem ipsum dolor sit amet.', '/cards/18.png']
  ];

  cards.forEach(([name, description, imageUrl], index) => {
    const cardNumber = index + 1;  // Card number 1 to 18
    db.run(insertCard, [cardNumber, name, description, imageUrl], (err: Error | null) => {
      if (err) {
        console.error('Error inserting card:', err);
        return;
      }
      console.log(`Card ${name} inserted`);
    });
  });

  // Insert augments for all cards for Game 1, but only for the first 9 cards for Game 2
  const insertAugment = `INSERT INTO augments (cardNumber, gameNumber, augmentDescription) VALUES (?, ?, ?)`;
  const augments = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
    'Fusce convallis metus id felis luctus adipiscing. Nulla volutpat alta, eu viverra felis mattis.',
    'Sed euismod ipsum dolor sit amet elit bibendum cursus.',
    'Donec id dui erat. Integer auctor magna odio ac tincidunt.',
    'Nulla ac leo at libero fermentum egestas non nec lorem.',
    'Pellentesque tincidunt est eu massa fringilla, in tincidunt purus fermentum.',
    'Aliquam erat volutpat. Ut ac diam et nunc dignissim pharetra.',
    'Sed auctor ipsum et sapien euismod gravida.',
    'Pellentesque tincidunt est eu massa fringilla, in tincidunt purus fermentum.',
    'Donec id dui erat. Integer auctor magna odio ac tincidunt.',
    'Sed euismod ipsum dolor sit amet elit bibendum cursus.',
    'Fusce convallis metus id felis luctus adipiscing. Nulla volutpat alta, eu viverra felis mattis.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ];

  augments.forEach((augmentDescription, index) => {
    const cardNumber = (index % 18) + 1;  // Card number 1 to 18 (cycle through)

    // For Game 1, add the augment for all cards (1 to 18)
    db.run(insertAugment, [cardNumber, 1, augmentDescription], (err: Error | null) => {
      if (err) {
        console.error('Error inserting augment for Game 1:', err);
        return;
      }
      console.log(`Augment for card ${cardNumber} in Game 1 inserted`);
    });

    // For Game 2, add the augment only for cards 1 to 9
    if (cardNumber <= 9) {
      db.run(insertAugment, [cardNumber, 2, augmentDescription], (err: Error | null) => {
        if (err) {
          console.error('Error inserting augment for Game 2:', err);
          return;
        }
        console.log(`Augment for card ${cardNumber} in Game 2 inserted`);
      });
    }
  });

  // Insert 2 games
  const insertGame = `INSERT INTO games (gameNumber, name, description, imageUrl) VALUES (?, ?, ?, ?)`;

  // Game 1
  const game1Name = 'Example Game 1';
  const game1Description = 'This is the first example game description.';
  const game1ImageUrl = '/games/1.png';
  db.run(insertGame, [1, game1Name, game1Description, game1ImageUrl], (err: Error | null) => {
    if (err) {
      console.error('Error inserting game 1:', err);
      return;
    }
    console.log('Game 1 inserted');
  });

  // Game 2
  const game2Name = 'Example Game 2';
  const game2Description = 'This is the second example game description.';
  const game2ImageUrl = '/games/2.png';
  db.run(insertGame, [2, game2Name, game2Description, game2ImageUrl], (err: Error | null) => {
    if (err) {
      console.error('Error inserting game 2:', err);
      return;
    }
    console.log('Game 2 inserted');
  });
};

insertDefaultData();
