/* Enemies the player must avoid */
class Enemy {

  /* Initialize the Enemy object.
   *
   * Param: row, the row you want the Enemy to appear on
   * Param: col, the column you want the Enemy to appear on
   * Param: speed, the number of blocks you want the enemy to move per second
   *
   * Row and Col values are automatically converted to X and Y. Counting starts at 1 (NOT zero)
   *
   */
  constructor(row, col, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = (col - 1) * 101; // 101 is the row width
    this.y = (row - 1) * 83 - 24; // 83 is row height, 24 is one-time offset from canvas top
    this.speed = speed; // Movement in pixels per tick
  }

  /* Update the position of the object on the screen, required for game
   * Param: dt, a delta between ticks ensuring equal speed on each computer.
   */
  update(dt) {
    this.updateHorizontalPosition(dt);
  }

  updateHorizontalPosition(dt) {

    this.x = this.isObjectOutOfRightBound()
      ? -101
      : this.x + this.calculateSpeedPerTick(dt);

  }

  /*
   * Calculates speed in px per tick based on the speed property and the dt
   * Param: dt, the amount of seconds between ticks
   */
  calculateSpeedPerTick(dt) {

    const ticksPerSecond = 1 / dt,
          blockWidth = 101;

    return blockWidth * this.speed / ticksPerSecond;

  }

  /* Draw the enemy on the screen */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  isObjectOutOfRightBound() {
    return this.x > document.getElementsByTagName('canvas')[0].width;
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
      this.y = this.y - 83;
    } else {
      this.y = this.y + 83;
    }

  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* Instantiate objects to use in the game */
const player = new Player(),
      allEnemies = [
        new Enemy(2, 1, 3),
        new Enemy(3, 3, 2),
        new Enemy(4, 4, 1),
        new Enemy(4, 5, 1)
      ];

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
