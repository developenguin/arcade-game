import CONSTANTS from './constants';
import GameState from './GameState';

export default class Player {

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
      GameState.increaseScore();
      GameState.changeAllEnemySpeed(gameState.score / CONSTANTS.difficultyModifier);
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
