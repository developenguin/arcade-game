const CONSTANTS = {
  dx: 101, // block width
  dy: 83, // block height
  offset: 24, // distance from canvas top to the first row

  canvasWidth: document.getElementsByTagName('canvas')[0].width,
  canvasHeight: document.getElementsByTagName('canvas')[0].height
};

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

    this.x = (col - 1) * CONSTANTS.dx;
    this.y = (row - 1) * CONSTANTS.dy - CONSTANTS.offset;
    this.speed = speed; // Movement in pixels per tick

  }

  /* Update the position of the object on the screen, required for game
   * Param: dt, the amount of seconds between ticks
   */
  update(dt) {
    this.updateHorizontalPosition(dt);
  }

  /*
   * Calculate the change in horizontal position for the enemy and make it wrap around
   * Param: dt, the amount of seconds between ticks
   */
  updateHorizontalPosition(dt) {

    this.x = this.isObjectOutOfRightBound()
      ? -CONSTANTS.dy
      : this.x + this.calculateSpeedPerTick(dt);

  }

  /*
   * Calculates speed in px per tick based on the speed property and the dt
   * Param: dt, the amount of seconds between ticks
   */
  calculateSpeedPerTick(dt) {

    const ticksPerSecond = 1 / dt,
          blockWidth = CONSTANTS.dx;

    return blockWidth * this.speed / ticksPerSecond;

  }

  /*
   * Draw the enemy on the screen
   * */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /*
   * Check if the enemy has passed the right side of the canvas
   */
  isObjectOutOfRightBound() {
    return this.x > CONSTANTS.canvasWidth;
  }
}

class Player {

  /*
   * Param: row, the row you want the Player to appear on
   * Param: col, the column you want the Player to appear on
   *
   * Row and Col values are automatically converted to X and Y. Counting starts at 1 (NOT zero)
   */
  constructor(row, col) {
    this.sprite = 'images/char-boy.png';
    this.x = (col - 1) * CONSTANTS.dx;
    this.y = (row - 1) * CONSTANTS.dy - CONSTANTS.offset;
  }

  /* Update the position of the player */
  update() {

  }

  /* Draw the player on screen */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /*
   * Handle key input
   * Param: direction, a string 'left', 'right', 'up' or 'down'
   */
  handleInput(direction) {

    if (this.isNextMoveOutOfBounds(direction)) {
      return;
    }

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

  /*
   * Move the player left or right
   * Param: direction, a string with value 'left' or 'right'
   */
  handleHorizontalInput(direction) {

    if (direction === 'left') {
      this.x = this.x - 101;
    } else {
      this.x = this.x + 101;
    }

  }

  /*
   * Move the player up or down
   * Param: direction, a string with value 'up' or 'down'
   */
  handleVerticalInput(direction) {

    if (direction === 'up') {
      this.y = this.y - 83;
    } else {
      this.y = this.y + 83;
    }

  }

  /*
   * Check if the next move will cause the player to move off the playing field
   * Param: direction, the direction the next move will be in
   */
  isNextMoveOutOfBounds(direction) {

    switch (direction) {
      case 'left':
        return this.x - CONSTANTS.dx < 0;
      case 'right':
        return this.x + CONSTANTS.dx > CONSTANTS.canvasWidth;
      case 'up':
        return this.y - CONSTANTS.dy < 0;
      case 'down':
        return this.y + CONSTANTS.dy > CONSTANTS.canvasHeight;
      default:
        return false;
    }

  }
}

/* Instantiate objects to use in the game */
const player = new Player(6, 3),
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
