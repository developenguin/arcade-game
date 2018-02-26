import Player from './Player';
import Enemy from './Enemy';
import GameState from './GameState';

/* Instantiate objects to use in the game */
const player = new Player(6, 3),
      gameState = new GameState(),
      allEnemies = [
        new Enemy(2, 4, 2.7),
        new Enemy(2, 1, 3.5),
        new Enemy(3, 3, 3),
        new Enemy(3, 1, 2.1),
        new Enemy(4, 4, 2),
        new Enemy(4, 5, 1.8)
      ];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
  const allowedKeys = {
    37: 'left',
    65: 'left',
    38: 'up',
    87: 'up',
    39: 'right',
    68: 'right',
    40: 'down',
    83: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
