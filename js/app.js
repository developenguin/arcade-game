import CONSTANTS from './constants';

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

    if (this.isCollisionWithPlayer()) {
      gameState.decreaseScore();
      gameState.changeAllEnemySpeed(gameState.score / CONSTANTS.difficultyModifier);
      player.resetPosition();
    }
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
   * Increase the speed
   * Param: modifier, the amount with which to increase the speed
   */
  increaseSpeed(modifier) {
    this.speed = this.speed + modifier;
  }

  /*
   * Draw the enemy on the screen
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /*
   * Check if the enemy has passed the right side of the canvas
   */
  isObjectOutOfRightBound() {
    return this.x > CONSTANTS.canvasWidth;
  }

  /*
   * Checks if the player and the enemy sprite currently overlap at some point
   */
  isCollisionWithPlayer() {

    const ownBox = {
            x1: this.x,
            x2: this.x + CONSTANTS.dx,
            y1: this.y,
            y2: this.y + CONSTANTS.dy
          },
          playerBox = player.getCollisionBox();

    /*
     * To check for collisions, we do the following:
     * - A collision can only happen on the same row, so the y1 coordinates must be the same
     * - If they are, we need to check if the x1 position of the player is between the x1 and x2
     *    coordinates of the enemy OR the x2 position is (left and right collision)
     */

    if (playerBox.y1 !== ownBox.y1 ) {
      return false;
    }

    return (
      (playerBox.x1 + CONSTANTS.playerCollisionOffset > ownBox.x1
        && playerBox.x1 + CONSTANTS.playerCollisionOffset < ownBox.x2)
      || (playerBox.x2 - CONSTANTS.playerCollisionOffset > ownBox.x1
        && playerBox.x2 - CONSTANTS.playerCollisionOffset < ownBox.x2)
    );

  }
}

class GameState {

  /*
   * Initialize the game state
   */
  constructor() {
    this.score = 0;
  }

  increaseScore() {
    this.score++;
  }

  decreaseScore() {
    this.score--;
  }

  /*
   * Draw the scoreboard
   */
  render() {
    ctx.fillText(`Score: ${this.score}`, 32, 32);
  }

  /*
   * Changes the speed of all enemies
   * Param: modifier, the amount with which to modify the speed. Can be negative
   */
  changeAllEnemySpeed(modifier) {

    for (const enemy of allEnemies) {
      enemy.increaseSpeed(modifier);
    }

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

    this.initialX = (col - 1) * CONSTANTS.dx;
    this.initialY = (row - 1) * CONSTANTS.dy - CONSTANTS.offset;
  }

  /*
   * Check for collision or win conditions and act accordingly
   */
  update() {

    if (this.isOnFirstRow()) {
      gameState.increaseScore();
      gameState.changeAllEnemySpeed(gameState.score / CONSTANTS.difficultyModifier);
      this.resetPosition();
    }

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
      this.x = this.x - CONSTANTS.dx;
    } else {
      this.x = this.x + CONSTANTS.dx;
    }

  }

  /*
   * Move the player up or down
   * Param: direction, a string with value 'up' or 'down'
   */
  handleVerticalInput(direction) {

    if (direction === 'up') {
      this.y = this.y - CONSTANTS.dy;
    } else {
      this.y = this.y + CONSTANTS.dy;
    }

  }

  /*
   *
   */
  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
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
        return this.x + CONSTANTS.dx >= CONSTANTS.canvasWidth;
      case 'up':
        return this.y - CONSTANTS.dy < -CONSTANTS.offset;
      case 'down':
        return this.y + CONSTANTS.dy + CONSTANTS.offset >= 6 * CONSTANTS.dy; // we can't go below the rows
      default:
        return false;
    }

  }

  /*
   * Checks if the player is on the topmost row and therefore safe
   */
  isOnFirstRow() {
    return this.y < 0;
  }

  /*
   * Returns the collision box of the player
   */
  getCollisionBox() {

    return {
      x1: this.x,
      x2: this.x + CONSTANTS.dx,
      y1: this.y,
      y2: this.y + CONSTANTS.dy
    };

  }
}

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
