/* Enemies the player must avoid */
class Enemy {

  constructor(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
  }

  /* Update the position of the object on the screen, required for game
   * Param: dt, a delta between ticks ensuring equal speed on each computer.
   */
  update(dt) {

  }

  /* Draw the enemy on the screen */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Player {

  constructor(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
  }

  /* Update the position of the player */
  update() {

  }

  /* Draw the player on screen */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(direction) {

    switch (direction) {

      case 'left':
      case 'right':
        this.handleHorizontalInput(direction);
        break;

      case 'up':
      case 'down':
        this.handleVerticalInput(direction);
        break;

      default:
        break;

    }

  }

  handleHorizontalInput(direction) {

    if (direction === 'left') {
      this.x = this.x - 101;
    } else {
      this.x = this.x + 101;
    }

  }

  handleVerticalInput(direction) {

    if (direction === 'up') {
      this.y = this.y - 64;
    } else {
      this.y = this.y + 64;
    }

  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* Instantiate objects to use in the game */
const player = new Player(),
      allEnemies = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
