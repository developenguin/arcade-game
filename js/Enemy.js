/* Enemies the player must avoid */
import CONSTANTS from './constants';

export default class Enemy {

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
